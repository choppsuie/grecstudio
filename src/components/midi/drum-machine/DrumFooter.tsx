
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
      <Button size="sm" variant="outline" className="text-cyber-purple">
        <Settings className="w-4 h-4 mr-1" />
        Settings
      </Button>
      <Button 
        size="sm" 
        variant={showPatternEditor ? "default" : "outline"}
        onClick={onTogglePatternEditor}
        className={showPatternEditor ? "bg-cyber-purple text-white" : "text-cyber-purple"}
      >
        <Music className="w-4 h-4 mr-1" />
        {showPatternEditor ? "Hide Editor" : "Pattern Editor"}
      </Button>
    </div>
  );
};

export default DrumFooter;
