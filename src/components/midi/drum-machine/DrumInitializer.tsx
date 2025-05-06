
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface DrumInitializerProps {
  isRetrying: boolean;
  onRetry: () => void;
}

const DrumInitializer: React.FC<DrumInitializerProps> = ({ isRetrying, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-4">
      <div className="text-cyber-purple font-medium text-center text-lg">
        {isRetrying ? 'Initializing Audio...' : 'Audio Needs to be Initialized'}
      </div>
      <p className="text-center text-sm text-white/80 px-4 max-w-md">
        Web browsers require a user interaction before playing audio. 
        Click the button below to enable sound playback.
      </p>
      <Button 
        variant="default" 
        size="lg" 
        onClick={onRetry}
        disabled={isRetrying}
        className="bg-cyber-purple hover:bg-cyber-purple/90 text-white border-white/20 py-6 px-8 text-lg"
      >
        <RefreshCw className={`w-5 h-5 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
        {isRetrying ? 'Initializing Audio...' : 'Click to Initialize Audio'}
      </Button>
    </div>
  );
};

export default DrumInitializer;
