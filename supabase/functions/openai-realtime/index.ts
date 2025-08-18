import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Check for WebSocket upgrade
  const upgrade = req.headers.get("upgrade") || ""
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 426 })
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    // Upgrade to WebSocket
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req)
    
    let openaiSocket: WebSocket | null = null

    // Configure the session for cooking assistant
    const sessionUpdate = {
      type: "session.update",
      session: {
        modalities: ["text", "audio"],
        instructions: `You are a helpful cooking assistant. Help users with recipes, cooking techniques, ingredient substitutions, and meal planning. Be conversational and encouraging. Keep responses concise and practical.`,
        voice: "alloy",
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",
        input_audio_transcription: {
          model: "whisper-1"
        },
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 200
        },
        tools: [],
        tool_choice: "auto",
        temperature: 0.8,
        max_response_output_tokens: "inf"
      }
    }

    clientSocket.onopen = () => {
      console.log('Client WebSocket connected')
      
      // Create WebSocket connection to OpenAI Realtime API
      openaiSocket = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'realtime=v1'
        }
      })

      openaiSocket.onopen = () => {
        console.log('Connected to OpenAI Realtime API')
        // Send session configuration
        openaiSocket?.send(JSON.stringify(sessionUpdate))
        
        // Notify client of successful connection
        clientSocket.send(JSON.stringify({ type: 'session.created' }))
      }

      openaiSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('Received from OpenAI:', data.type)
          
          // Forward all messages to client
          clientSocket.send(event.data)
        } catch (error) {
          console.error('Error processing OpenAI message:', error)
        }
      }

      openaiSocket.onerror = (error) => {
        console.error('OpenAI WebSocket error:', error)
        clientSocket.send(JSON.stringify({ type: 'error', error: 'OpenAI connection error' }))
      }

      openaiSocket.onclose = () => {
        console.log('OpenAI WebSocket closed')
        clientSocket.close()
      }
    }

    clientSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('Received from client:', data.type)
        
        // Forward all messages to OpenAI
        if (openaiSocket && openaiSocket.readyState === WebSocket.OPEN) {
          openaiSocket.send(event.data)
        }
      } catch (error) {
        console.error('Error processing client message:', error)
      }
    }

    clientSocket.onclose = () => {
      console.log('Client WebSocket disconnected')
      if (openaiSocket) {
        openaiSocket.close()
      }
    }

    clientSocket.onerror = (error) => {
      console.error('Client WebSocket error:', error)
      if (openaiSocket) {
        openaiSocket.close()
      }
    }

    return response

  } catch (error) {
    console.error('Error in openai-realtime function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})