
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DrumPad } from "@/hooks/drum-machine/types";
import { PlayCircle, Save } from "lucide-react";
import { DrumPattern } from "../DrumPads";

interface PatternEditorProps {
  currentPattern: DrumPattern;
  currentStep: number;
  isPlaying: boolean;
  currentPads: DrumPad[];
  togglePlay: () => void;
  clearPattern: () => void;
  savePattern: () => void;
  toggleStep: (padId: string, step: number) => void;
}

const PatternEditor: React.FC<PatternEditorProps> = ({
  currentPattern,
  currentStep,
  isPlaying,
  currentPads,
  togglePlay,
  clearPattern,
  savePattern,
  toggleStep
}) => {
  const STEPS = 16;
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-semibold text-cyber-purple">Pattern Editor</h4>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={togglePlay} 
            className={isPlaying 
              ? "bg-cyber-purple/20 text-cyber-purple border-cyber-purple/50" 
              : "bg-cyber-darker text-cyber-purple border-cyber-purple/50 hover:bg-cyber-purple/20"}
          >
            <PlayCircle className="w-4 h-4 mr-1" />
            {isPlaying ? "Stop" : "Play"}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={clearPattern} 
            className="bg-cyber-darker text-cyber-purple border-cyber-purple/50 hover:bg-cyber-purple/20"
          >
            Clear
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={savePattern} 
            className="bg-cyber-darker text-cyber-purple border-cyber-purple/50 hover:bg-cyber-purple/20"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <div className="bg-cyber-darker p-2 rounded-md">
        <div className="grid grid-cols-16 gap-1 mb-1">
          {[...Array(STEPS)].map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "text-center text-xs font-mono h-6 flex items-center justify-center",
                currentStep === i && isPlaying ? "bg-cyber-purple/30 text-white" : "text-cyber-purple"
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>
        
        {currentPads.map((pad) => (
          <div key={pad.id} className="flex items-center mb-1">
            <div 
              className="w-12 text-xs truncate mr-1 py-1 px-2"
              style={{ color: pad.color }}
            >
              {pad.name}
            </div>
            <div className="grid grid-cols-16 gap-1 flex-1">
              {(currentPattern.steps[pad.id] || Array(STEPS).fill(false)).map((active, step) => (
                <div
                  key={`${pad.id}-${step}`}
                  className={cn(
                    "h-6 rounded cursor-pointer transition-all",
                    active ? "bg-opacity-80" : "bg-opacity-10",
                    currentStep === step && isPlaying ? "ring-1 ring-white" : ""
                  )}
                  style={{ 
                    backgroundColor: active ? pad.color : `${pad.color}40`
                  }}
                  onClick={() => toggleStep(pad.id, step)}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatternEditor;
