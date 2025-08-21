import { Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const WifiButton = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleClick = () => {
    setIsConnected(!isConnected);
    toast({
      title: isConnected ? "Disconnected" : "Connected",
      description: isConnected ? "WiFi disconnected" : "WiFi connected successfully",
    });
  };

  const getButtonStyles = () => {
    const baseStyles = "fixed right-4 top-1/2 translate-y-8 z-[9999] w-16 h-16 rounded-full shadow-2xl border-2 border-white transition-all duration-300";
    
    if (isConnected) {
      return `${baseStyles} bg-green-500 hover:bg-green-600`;
    } else {
      return `${baseStyles} bg-gray-500 hover:bg-gray-600`;
    }
  };

  return (
    <Button
      size="icon"
      className={getButtonStyles()}
      onClick={handleClick}
      title={isConnected ? "WiFi Connected - Click to disconnect" : "WiFi Disconnected - Click to connect"}
    >
      {isConnected ? (
        <Wifi className="w-8 h-8 text-white" />
      ) : (
        <WifiOff className="w-8 h-8 text-white" />
      )}
    </Button>
  );
};