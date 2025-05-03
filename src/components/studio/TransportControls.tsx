
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Square, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Metronome from './Metronome';

interface TransportControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  bpm: number;
  onBpmChange: (bpm: number) => void;
}

const TransportControls = ({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  bpm,
  onBpmChange
}: TransportControlsProps) => {
  const [localBpm, setLocalBpm] = useState(bpm.toString());
  const [currentTime, setCurrentTime] = useState("00:00.000");
  
  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalBpm(value);
  };
  
  const handleBpmBlur = () => {
    const newBpm = parseInt(localBpm);
    if (!isNaN(newBpm) && newBpm > 20 && newBpm < 300) {
      onBpmChange(newBpm);
    } else {
      setLocalBpm(bpm.toString());
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBpmBlur();
    }
  };
  
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-1 bg-cyber-dark p-1 rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-7 w-7 transition-all",
            "hover:bg-cyber-purple/20"
          )}
          onClick={onStop}
        >
          <Square className="h-3.5 w-3.5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-cyber-purple/20"
        >
          <SkipBack className="h-3.5 w-3.5" />
        </Button>
        
        {!isPlaying ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-cyber-purple/20 hover:bg-cyber-purple/30"
            onClick={onPlay}
          >
            <Play className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-cyber-purple/20 hover:bg-cyber-purple/30"
            onClick={onPause}
          >
            <Pause className="h-3.5 w-3.5" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-cyber-purple/20"
        >
          <SkipForward className="h-3.5 w-3.5" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="font-mono text-xs bg-cyber-dark px-2 py-1 rounded-sm min-w-[80px] text-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
          {currentTime}
        </div>
        
        <div className="flex items-center space-x-1 bg-cyber-dark rounded-sm px-1 shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
          <Clock className="h-3.5 w-3.5 text-cyber-purple/70" />
          <Input
            value={localBpm}
            onChange={handleBpmChange}
            onBlur={handleBpmBlur}
            onKeyDown={handleKeyDown}
            className="h-7 w-12 bg-transparent border-none text-xs p-0 text-center"
          />
          <span className="text-xs text-cyber-purple/70">BPM</span>
        </div>
        
        <Metronome />
      </div>
    </div>
  );
};

export default TransportControls;
