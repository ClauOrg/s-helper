import { useState, useRef, useCallback } from 'react';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { useToast } from '@/hooks/use-toast';

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export const useRealtimeChat = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const chatRef = useRef<RealtimeChat | null>(null);
  const { toast } = useToast();

  const handleMessage = useCallback((event: any) => {
    console.log('Received message:', event);
    setMessages(prev => [...prev, event]);
    
    // Handle different event types
    if (event.type === 'response.audio.delta') {
      // Audio is being received
    } else if (event.type === 'response.audio.done') {
      // Audio response completed
    } else if (event.type === 'response.audio_transcript.delta') {
      // Text transcript received
      console.log('Transcript:', event.delta);
    }
  }, []);

  const handleConnectionStateChange = useCallback((state: 'connected' | 'disconnected' | 'error') => {
    setConnectionState(state);
    
    if (state === 'connected') {
      toast({
        title: "Connected",
        description: "Connected to OpenAI Realtime API",
      });
    } else if (state === 'error') {
      toast({
        title: "Connection Error",
        description: "Failed to connect to OpenAI",
        variant: "destructive",
      });
      setIsRecording(false);
    } else if (state === 'disconnected') {
      setIsRecording(false);
    }
  }, [toast]);

  const connect = useCallback(async () => {
    if (connectionState !== 'disconnected') return;
    
    setConnectionState('connecting');
    
    try {
      chatRef.current = new RealtimeChat(handleMessage, handleConnectionStateChange);
      await chatRef.current.init();
    } catch (error) {
      console.error('Connection failed:', error);
      setConnectionState('error');
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  }, [connectionState, handleMessage, handleConnectionStateChange, toast]);

  const disconnect = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.disconnect();
      chatRef.current = null;
    }
    setConnectionState('disconnected');
    setIsRecording(false);
    setMessages([]);
  }, []);

  const startRecording = useCallback(async () => {
    if (!chatRef.current?.connected || isRecording) return;
    
    try {
      await chatRef.current.startRecording();
      setIsRecording(true);
      toast({
        title: "Recording Started",
        description: "Listening for your voice...",
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Recording Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  }, [isRecording, toast]);

  const stopRecording = useCallback(() => {
    if (chatRef.current && isRecording) {
      chatRef.current.stopRecording();
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Processing your message...",
      });
    }
  }, [isRecording, toast]);

  const sendMessage = useCallback(async (text: string) => {
    if (!chatRef.current?.connected) return;
    
    try {
      await chatRef.current.sendMessage(text);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Send Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    connectionState,
    isRecording,
    messages,
    connect,
    disconnect,
    startRecording,
    stopRecording,
    sendMessage,
    isConnected: connectionState === 'connected'
  };
};