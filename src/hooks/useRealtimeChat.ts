import { useState, useRef, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

export type ChatState = 'idle' | 'connecting' | 'connected' | 'speaking' | 'listening' | 'error'

interface RealtimeChatMessage {
  type: string
  [key: string]: any
}

export const useRealtimeChat = () => {
  const [chatState, setChatState] = useState<ChatState>('idle')
  const [isConnected, setIsConnected] = useState(false)
  const websocketRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const connectToRealtime = useCallback(async () => {
    try {
      // Prevent multiple simultaneous connections
      if (chatState === 'connecting' || isConnected) {
        console.log('Already connecting or connected, skipping')
        return
      }

      setChatState('connecting')
      console.log('Starting realtime connection...')

      // Set connection timeout
      connectionTimeoutRef.current = setTimeout(() => {
        console.error('Connection timeout after 10 seconds')
        setChatState('error')
        toast({
          title: "Connection Timeout",
          description: "Failed to connect to voice assistant within 10 seconds",
          variant: "destructive",
        })
      }, 10000)

      // Initialize audio context for playing responses
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      // Use correct WebSocket URL format for Supabase Edge Functions
      const wsUrl = `wss://vxsfjofnyzwhlqxavdpy.supabase.co/functions/v1/openai-realtime`
      console.log('Attempting to connect to WebSocket URL:', wsUrl)
      
      const websocket = new WebSocket(wsUrl)
      websocketRef.current = websocket

      websocket.onopen = () => {
        console.log('WebSocket connected to Edge Function')
        
        // Clear connection timeout
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current)
          connectionTimeoutRef.current = null
        }
        
        setIsConnected(true)
        setChatState('connected')
        console.log('Connection state updated to: connected')
        
        toast({
          title: "Connected",
          description: "Voice assistant is ready!",
        })
      }

      websocket.onmessage = (event) => {
        try {
          const data: RealtimeChatMessage = JSON.parse(event.data)
          handleRealtimeMessage(data)
        } catch (error) {
          console.error('Error parsing realtime message:', error)
        }
      }

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error)
        console.error('WebSocket URL was:', wsUrl)
        
        // Clear connection timeout
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current)
          connectionTimeoutRef.current = null
        }
        
        setIsConnected(false)
        setChatState('error')
        
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice assistant. Please check your connection.",
          variant: "destructive",
        })
      }

      websocket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason)
        
        // Clear connection timeout
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current)
          connectionTimeoutRef.current = null
        }
        
        setIsConnected(false)
        setChatState('idle')
      }

    } catch (error) {
      console.error('Error connecting to realtime chat:', error)
      
      // Clear connection timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current)
        connectionTimeoutRef.current = null
      }
      
      setChatState('error')
      toast({
        title: "Connection Failed",
        description: "Could not start voice assistant",
        variant: "destructive",
      })
    }
  }, [toast, chatState, isConnected])

  const handleRealtimeMessage = useCallback((message: RealtimeChatMessage) => {
    console.log('Received realtime message:', message.type, message)

    switch (message.type) {
      case 'session.created':
        console.log('Session created, switching to listening')
        setChatState('listening')
        break
      
      case 'input_audio_buffer.speech_started':
        console.log('Speech started')
        setChatState('listening')
        break
      
      case 'input_audio_buffer.speech_stopped':
        console.log('Speech stopped, processing...')
        setChatState('listening') // Stay in listening state, not connecting
        break
      
      case 'response.audio.delta':
        if (message.delta && audioContextRef.current) {
          console.log('Received audio delta, switching to speaking')
          setChatState('speaking')
          playAudioDelta(message.delta)
        }
        break
      
      case 'response.audio.done':
        console.log('Audio response done, back to listening')
        setChatState('listening')
        break
      
      case 'error':
        console.error('Realtime API error:', message.error)
        setChatState('error')
        toast({
          title: "Assistant Error",
          description: message.error?.message || "Something went wrong",
          variant: "destructive",
        })
        break
        
      default:
        console.log('Unhandled message type:', message.type)
        break
    }
  }, [toast])

  const playAudioDelta = useCallback(async (audioData: string) => {
    if (!audioContextRef.current) return

    try {
      // Decode base64 audio data
      const binaryString = atob(audioData)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      // Convert PCM16 to AudioBuffer and play
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer)
      const source = audioContextRef.current.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContextRef.current.destination)
      source.start()
    } catch (error) {
      console.error('Error playing audio:', error)
    }
  }, [])

  const sendAudio = useCallback(async (audioBlob: Blob) => {
    if (!isConnected || !websocketRef.current) {
      console.log('Cannot send audio: not connected')
      return
    }

    try {
      console.log('Sending audio blob of size:', audioBlob.size)

      // Convert audio blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer()
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

      // Send audio data via WebSocket
      const audioMessage = {
        type: "input_audio_buffer.append",
        audio: base64Audio
      }

      websocketRef.current.send(JSON.stringify(audioMessage))
      console.log('Audio sent successfully')

    } catch (error) {
      console.error('Error sending audio:', error)
      setChatState('error')
      toast({
        title: "Send Error",
        description: "Failed to send audio message",
        variant: "destructive",
      })
    }
  }, [isConnected, toast])

  const disconnect = useCallback(() => {
    console.log('Disconnecting from realtime chat')
    
    // Clear connection timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current)
      connectionTimeoutRef.current = null
    }
    
    if (websocketRef.current) {
      websocketRef.current.close()
      websocketRef.current = null
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    setIsConnected(false)
    setChatState('idle')
  }, [])

  return {
    chatState,
    isConnected,
    connectToRealtime,
    sendAudio,
    disconnect,
  }
}