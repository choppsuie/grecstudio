
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface DrumInitializerProps {
  isRetrying: boolean;
  onRetry: () => void;
}

const DrumInitializer: React.FC<DrumInitializerProps> = ({ isRetrying, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 space-y-3">
      <div className="text-cyber-purple text-sm">
        {isRetrying ? 'Retrying...' : 'Failed to load drum samples'}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRetry}
        disabled={isRetrying}
        className="text-cyber-purple border-cyber-purple"
      >
        <RefreshCw className={`w-4 h-4 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
        {isRetrying ? 'Loading...' : 'Click to Initialize Audio'}
      </Button>
    </div>
  );
};

export default DrumInitializer;
