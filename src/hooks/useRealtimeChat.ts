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
  const { toast } = useToast()

  const connectToRealtime = useCallback(async () => {
    try {
      setChatState('connecting')

      // Initialize audio context for playing responses
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      // Create WebSocket connection to our Supabase Edge Function
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = window.location.host
      const wsUrl = `${protocol}//${host}/functions/v1/openai-realtime`
      
      const websocket = new WebSocket(wsUrl)
      websocketRef.current = websocket

      websocket.onopen = () => {
        console.log('WebSocket connected to Edge Function')
        setIsConnected(true)
        setChatState('connected')
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
        setIsConnected(false)
        setChatState('error')
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice assistant",
          variant: "destructive",
        })
      }

      websocket.onclose = () => {
        console.log('WebSocket connection closed')
        setIsConnected(false)
        setChatState('idle')
      }

    } catch (error) {
      console.error('Error connecting to realtime chat:', error)
      setChatState('error')
      toast({
        title: "Connection Failed",
        description: "Could not start voice assistant",
        variant: "destructive",
      })
    }
  }, [toast])

  const handleRealtimeMessage = useCallback((message: RealtimeChatMessage) => {
    console.log('Realtime message:', message.type)

    switch (message.type) {
      case 'session.created':
        setChatState('listening')
        break
      
      case 'input_audio_buffer.speech_started':
        setChatState('listening')
        break
      
      case 'input_audio_buffer.speech_stopped':
        setChatState('connecting') // Processing state
        break
      
      case 'response.audio.delta':
        if (message.delta && audioContextRef.current) {
          setChatState('speaking')
          playAudioDelta(message.delta)
        }
        break
      
      case 'response.audio.done':
        setChatState('listening')
        break
      
      case 'error':
        setChatState('error')
        toast({
          title: "Assistant Error",
          description: message.error?.message || "Something went wrong",
          variant: "destructive",
        })
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
    if (!isConnected || !websocketRef.current) return

    try {
      setChatState('connecting')

      // Convert audio blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer()
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

      // Send audio data via WebSocket
      const audioMessage = {
        type: "input_audio_buffer.append",
        audio: base64Audio
      }

      websocketRef.current.send(JSON.stringify(audioMessage))

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