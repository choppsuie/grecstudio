
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Save, Share2, Volume2 } from "lucide-react";
import { useState } from "react";

interface MixerControlsProps {
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  isPlaying?: boolean;
}

const MixerControls = ({
  onPlay,
  onPause,
  onStop,
  onSave,
  onShare,
  isPlaying = false
}: MixerControlsProps) => {
  const [playPosition, setPlayPosition] = useState(0);
  const [volume, setVolume] = useState(80);
  
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };
  
  const handlePositionChange = (value: number[]) => {
    setPlayPosition(value[0]);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const handleStop = () => {
    onStop?.();
    setPlayPosition(0);
  };
  
  return (
    <div className="bg-cyber-darker border-t border-cyber-purple/20 p-4 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-cyber-purple hover:bg-cyber-purple/10"
            onClick={handleStop}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 text-white bg-cyber-purple/20 hover:bg-cyber-purple/30 rounded-full flex items-center justify-center"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-cyber-purple hover:bg-cyber-purple/10"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
          
          <div className="text-xs text-white/60 font-mono">
            00:00:00
          </div>
        </div>
        
        <div className="flex-1 mx-6">
          <Slider
            value={[playPosition]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={handlePositionChange}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="text-white/60">
              <Volume2 className="h-5 w-5" />
            </div>
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-cyber-purple hover:bg-cyber-purple/10"
            onClick={onSave}
          >
            <Save className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-cyber-blue hover:bg-cyber-blue/10"
            onClick={onShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MixerControls;
