import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const MicButton = () => {
  const { recordingState, isSupported, startRecording, stopRecording, getAudioBlob, reset } = useAudioRecording();
  const { chatState, isConnected, connectToRealtime, sendAudio, disconnect } = useRealtimeChat();
  const { toast } = useToast();
  
  // Auto-connect to realtime service when component mounts
  useEffect(() => {
    if (!isConnected && chatState === 'idle') {
      connectToRealtime();
    }
  }, [isConnected, chatState, connectToRealtime]);

  // Handle recording completion
  useEffect(() => {
    if (recordingState === 'processing') {
      const audioBlob = getAudioBlob();
      if (audioBlob && isConnected) {
        sendAudio(audioBlob);
      }
      reset();
    }
  }, [recordingState, getAudioBlob, sendAudio, isConnected, reset]);

  const handleClick = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Audio recording is not supported in this browser",
        variant: "destructive",
      });
      return;
    }

    if (!isConnected) {
      await connectToRealtime();
      return;
    }

    if (recordingState === 'idle') {
      try {
        await startRecording();
      } catch (error) {
        toast({
          title: "Recording Error",
          description: error instanceof Error ? error.message : "Failed to start recording",
          variant: "destructive",
        });
      }
    } else if (recordingState === 'recording') {
      stopRecording();
    }
  };

  const getButtonState = () => {
    if (!isConnected || chatState === 'connecting') return 'connecting';
    if (recordingState === 'recording' || chatState === 'listening') return 'recording';
    if (recordingState === 'processing') return 'processing';
    if (chatState === 'speaking') return 'speaking';
    return 'idle';
  };

  const getButtonIcon = () => {
    const state = getButtonState();
    switch (state) {
      case 'connecting':
      case 'processing':
        return <Loader2 className="w-8 h-8 text-white animate-spin" />;
      case 'recording':
        return <MicOff className="w-8 h-8 text-white" />;
      case 'speaking':
        return <Volume2 className="w-8 h-8 text-white animate-pulse" />;
      default:
        return <Mic className="w-8 h-8 text-white" />;
    }
  };

  const getButtonStyles = () => {
    const state = getButtonState();
    const baseStyles = "fixed right-4 top-1/2 -translate-y-1/2 z-[9999] w-16 h-16 rounded-full shadow-2xl border-2 border-white transition-all duration-300";
    
    switch (state) {
      case 'connecting':
        return `${baseStyles} bg-yellow-500 hover:bg-yellow-600`;
      case 'recording':
        return `${baseStyles} bg-red-600 hover:bg-red-700 animate-pulse`;
      case 'processing':
        return `${baseStyles} bg-blue-500 hover:bg-blue-600`;
      case 'speaking':
        return `${baseStyles} bg-green-500 hover:bg-green-600`;
      default:
        return `${baseStyles} bg-primary hover:bg-primary/90`;
    }
  };

  const getTooltipText = () => {
    const state = getButtonState();
    switch (state) {
      case 'connecting':
        return 'Connecting to voice assistant...';
      case 'recording':
        return 'Recording... Click to stop';
      case 'processing':
        return 'Processing your request...';
      case 'speaking':
        return 'Assistant is speaking...';
      default:
        return 'Click to start voice chat';
    }
  };

  return (
    <Button
      size="icon"
      className={getButtonStyles()}
      onClick={handleClick}
      disabled={recordingState === 'processing' || chatState === 'connecting'}
      title={getTooltipText()}
    >
      {getButtonIcon()}
    </Button>
  );
};