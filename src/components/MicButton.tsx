import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const MicButton = () => {
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  const handleClick = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Mic Off" : "Mic On",
      description: isActive ? "Microphone disabled" : "Microphone enabled",
    });
  };

  const getButtonStyles = () => {
    const baseStyles = "fixed right-4 top-1/2 -translate-y-1/2 z-[9999] w-16 h-16 rounded-full shadow-2xl border-2 border-white transition-all duration-300";
    
    if (isActive) {
      return `${baseStyles} bg-red-500 hover:bg-red-600`;
    } else {
      return `${baseStyles} bg-primary hover:bg-primary/90`;
    }
  };

  return (
    <Button
      size="icon"
      className={getButtonStyles()}
      onClick={handleClick}
      title={isActive ? "Microphone is active - Click to deactivate" : "Microphone is inactive - Click to activate"}
    >
      <Mic className="w-8 h-8 text-white" />
    </Button>
  );
};