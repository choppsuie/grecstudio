
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, Music } from "lucide-react";

interface DrumFooterProps {
  showPatternEditor: boolean;
  onTogglePatternEditor: () => void;
}

const DrumFooter: React.FC<DrumFooterProps> = ({ 
  showPatternEditor, 
  onTogglePatternEditor 
}) => {
  return (
    <div className="mt-4 flex justify-between">
      <Button 
        size="sm" 
        variant="outline" 
        className="bg-cyber-darker text-cyber-purple border-cyber-purple/50 hover:bg-cyber-purple/20"
      >
        <Settings className="w-4 h-4 mr-1" />
        Settings
      </Button>
      <Button 
        size="sm" 
        variant={showPatternEditor ? "default" : "outline"}
        onClick={onTogglePatternEditor}
        className={showPatternEditor 
          ? "bg-cyber-purple text-white hover:bg-cyber-purple/90" 
          : "bg-cyber-darker text-cyber-purple border-cyber-purple/50 hover:bg-cyber-purple/20"}
      >
        <Music className="w-4 h-4 mr-1" />
        {showPatternEditor ? "Hide Editor" : "Pattern Editor"}
      </Button>
    </div>
  );
};

export default DrumFooter;
