
import React from "react";
import { Volume2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface SynthControlsProps {
  currentSynth: string;
  volume: number;
  onSynthChange: (value: string) => void;
  onVolumeChange: (values: number[]) => void;
}

const SynthControls: React.FC<SynthControlsProps> = ({
  currentSynth,
  volume,
  onSynthChange,
  onVolumeChange,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Volume2 className="h-4 w-4 text-cyber-purple/70" />
        <Slider 
          className="w-24" 
          value={[volume]} 
          min={0} 
          max={100} 
          step={1} 
          onValueChange={onVolumeChange} 
        />
      </div>
      
      <Select defaultValue="basic" value={currentSynth} onValueChange={onSynthChange}>
        <SelectTrigger className="w-[120px] h-8 text-xs bg-cyber-darker border-cyber-purple/30">
          <SelectValue placeholder="Synth Type" />
        </SelectTrigger>
        <SelectContent className="bg-cyber-darker border-cyber-purple/30">
          <SelectItem value="basic" className="text-xs">Basic Synth</SelectItem>
          <SelectItem value="fm" className="text-xs">FM Synth</SelectItem>
          <SelectItem value="am" className="text-xs">AM Synth</SelectItem>
          <SelectItem value="membrane" className="text-xs">Percussion</SelectItem>
          <SelectItem value="pluck" className="text-xs">Pluck Synth</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SynthControls;
