import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MicButton = () => {
  console.log("MicButton is rendering"); // Debug log
  
  return (
    <Button
      size="icon"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[9999] w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-2xl border-2 border-white"
      onClick={() => {
        console.log("Mic button clicked - ready for voice commands");
        alert("Mic button works!"); // Temporary visual feedback
      }}
      style={{ position: 'fixed', right: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 9999 }}
    >
      <Mic className="w-8 h-8 text-white" />
    </Button>
  );
};