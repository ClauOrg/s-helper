import { useState, useRef, useCallback } from 'react'

export type RecordingState = 'idle' | 'recording' | 'processing' | 'playing'

export const useAudioRecording = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [isSupported, setIsSupported] = useState(true)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const startRecording = useCallback(async () => {
    try {
      // Check if browser supports required APIs
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsSupported(false)
        throw new Error('Browser does not support audio recording')
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      streamRef.current = stream
      audioChunksRef.current = []

      // Create MediaRecorder with PCM audio format
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      })

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        setRecordingState('processing')
      }

      mediaRecorder.start(100) // Collect data every 100ms for real-time streaming
      setRecordingState('recording')

    } catch (error) {
      console.error('Error starting recording:', error)
      setRecordingState('idle')
      throw new Error('Failed to start recording. Please check microphone permissions.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop()
      
      // Stop all tracks to release microphone
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [recordingState])

  const getAudioBlob = useCallback((): Blob | null => {
    if (audioChunksRef.current.length === 0) return null
    
    return new Blob(audioChunksRef.current, { type: 'audio/webm' })
  }, [])

  const reset = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null
    }
    
    audioChunksRef.current = []
    setRecordingState('idle')
  }, [])

  return {
    recordingState,
    isSupported,
    startRecording,
    stopRecording,
    getAudioBlob,
    reset,
  }
}