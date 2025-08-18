import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MicButton = () => {
  return (
    <Button
      size="icon"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
      onClick={() => {
        // Future AI voice command functionality will be added here
        console.log("Mic button clicked - ready for voice commands");
      }}
    >
      <Mic className="w-6 h-6 text-primary-foreground" />
    </Button>
  );
};