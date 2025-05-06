
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";
import { DrumKitType } from "@/hooks/drum-machine/types";

interface DrumControlsProps {
  selectedKit: DrumKitType;
  availableKits: { id: DrumKitType; name: string }[];
  volume: number;
  isRetrying: boolean;
  isLoaded: boolean;
  onKitChange: (kitId: string) => void;
  onVolumeChange: (value: number[]) => void;
  onRetry: () => void;
}

const DrumControls: React.FC<DrumControlsProps> = ({
  selectedKit,
  availableKits,
  volume,
  isRetrying,
  isLoaded,
  onKitChange,
  onVolumeChange,
  onRetry
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-cyber-purple text-lg font-bold">Drum Machine</h3>
        <div className="flex items-center space-x-2">
          <Volume2 className="text-cyber-purple w-4 h-4" />
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            className="w-24"
            onValueChange={onVolumeChange}
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {availableKits.map((kit) => (
            <Button
              key={kit.id}
              variant={selectedKit === kit.id ? "default" : "outline"}
              size="sm"
              onClick={() => onKitChange(kit.id)}
              disabled={!isLoaded && selectedKit !== kit.id || isRetrying}
              className={selectedKit === kit.id 
                ? "bg-cyber-purple text-white hover:bg-cyber-purple/90" 
                : "bg-cyber-darker text-cyber-purple border-cyber-purple/50 hover:bg-cyber-purple/20"}
            >
              {kit.name}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default DrumControls;
