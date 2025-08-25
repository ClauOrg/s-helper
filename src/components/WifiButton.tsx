import { Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";

export const WifiButton = () => {
  const { connectionState, connect, disconnect, isConnected } = useRealtimeChat();

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const getButtonStyles = () => {
    const baseStyles = "fixed right-4 top-1/2 translate-y-8 z-[9999] w-16 h-16 rounded-full shadow-2xl border-2 border-white transition-all duration-300";
    
    if (connectionState === 'connected') {
      return `${baseStyles} bg-green-500 hover:bg-green-600`;
    } else if (connectionState === 'error') {
      return `${baseStyles} bg-red-500 hover:bg-red-600`;
    } else if (connectionState === 'connecting') {
      return `${baseStyles} bg-yellow-500 hover:bg-yellow-600`;
    } else {
      return `${baseStyles} bg-muted hover:bg-muted/80`;
    }
  };

  const getTitle = () => {
    switch (connectionState) {
      case 'connected':
        return "Connected to OpenAI - Click to disconnect";
      case 'connecting':
        return "Connecting to OpenAI...";
      case 'error':
        return "Connection failed - Click to retry";
      default:
        return "Click to connect to OpenAI";
    }
  };

  return (
    <Button
      size="icon"
      className={getButtonStyles()}
      onClick={handleClick}
      title={getTitle()}
      disabled={connectionState === 'connecting'}
    >
      {isConnected ? (
        <Wifi className="w-8 h-8 text-white" />
      ) : (
        <WifiOff className="w-8 h-8 text-white" />
      )}
    </Button>
  );
};