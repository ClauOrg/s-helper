import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const { audio_data, session_config } = await req.json()

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

    // Create WebSocket connection to OpenAI Realtime API
    const websocket = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1'
      }
    })

    // Create a response stream for the client
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()

    websocket.onopen = () => {
      console.log('Connected to OpenAI Realtime API')
      // Send session configuration
      websocket.send(JSON.stringify(sessionUpdate))
    }

    websocket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('Received from OpenAI:', data.type)
        
        // Forward all messages to client
        await writer.write(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`))
      } catch (error) {
        console.error('Error processing OpenAI message:', error)
      }
    }

    websocket.onerror = async (error) => {
      console.error('WebSocket error:', error)
      await writer.write(new TextEncoder().encode(`data: ${JSON.stringify({ type: 'error', error: 'Connection error' })}\n\n`))
    }

    websocket.onclose = async () => {
      console.log('OpenAI WebSocket closed')
      await writer.close()
    }

    // Handle audio data from client
    if (audio_data) {
      const audioAppend = {
        type: "input_audio_buffer.append",
        audio: audio_data
      }
      websocket.send(JSON.stringify(audioAppend))
    }

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

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