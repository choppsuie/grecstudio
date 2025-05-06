
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, Undo, Redo, Scissors, Copy, Trash2, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import TransportControls from "@/components/studio/TransportControls";
import { useStudio } from "@/contexts/StudioHooks";

const StudioToolbar = () => {
  const { 
    isPlaying,
    isRecording,
    handlePlay,
    handlePause,
    handleStop,
    handleRecord,
    handleSave,
    bpm,
    handleBpmChange
  } = useStudio();

  return (
    <div className="flex items-center h-10 px-2 border-t border-cyber-purple/10">
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-cyber-purple hover:bg-cyber-purple/10" 
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-cyber-purple hover:bg-cyber-purple/10"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-cyber-purple hover:bg-cyber-purple/10"
        >
          <Redo className="h-4 w-4" />
        </Button>
        <div className="h-8 border-r border-cyber-purple/20 mx-1"></div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-cyber-purple hover:bg-cyber-purple/10"
        >
          <Scissors className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-cyber-purple hover:bg-cyber-purple/10"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-cyber-purple hover:bg-cyber-purple/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="h-8 border-r border-cyber-purple/20 mx-1"></div>
        <Button 
          variant={isRecording ? "destructive" : "ghost"} 
          size="icon" 
          className={cn(
            "h-8 w-8", 
            isRecording ? "animate-pulse" : "text-cyber-purple hover:bg-cyber-purple/10"
          )} 
          onClick={handleRecord}
        >
          <Mic className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="ml-auto">
        <TransportControls 
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          bpm={bpm}
          onBpmChange={handleBpmChange}
        />
      </div>
    </div>
  );
};

export default StudioToolbar;
