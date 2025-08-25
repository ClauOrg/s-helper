import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";

export const MicButton = () => {
  const { isConnected, isRecording, startRecording, stopRecording } = useRealtimeChat();

  const handleClick = () => {
    if (!isConnected) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "fixed right-4 top-1/2 -translate-y-1/2 z-[9999] w-16 h-16 rounded-full shadow-2xl border-2 border-white transition-all duration-300";
    
    if (!isConnected) {
      return `${baseStyles} bg-muted hover:bg-muted/80 opacity-50`;
    } else if (isRecording) {
      return `${baseStyles} bg-red-500 hover:bg-red-600`;
    } else {
      return `${baseStyles} bg-primary hover:bg-primary/90`;
    }
  };

  const getTitle = () => {
    if (!isConnected) {
      return "Connect to OpenAI first using the WiFi button";
    } else if (isRecording) {
      return "Recording - Click to stop";
    } else {
      return "Click to start recording";
    }
  };

  return (
    <Button
      size="icon"
      className={getButtonStyles()}
      onClick={handleClick}
      title={getTitle()}
      disabled={!isConnected}
    >
      {isRecording ? (
        <MicOff className="w-8 h-8 text-white" />
      ) : (
        <Mic className="w-8 h-8 text-white" />
      )}
    </Button>
  );
};