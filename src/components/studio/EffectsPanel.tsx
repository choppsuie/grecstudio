
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const EffectsPanel = () => {
  const [effects, setEffects] = useState({
    eq: {
      enabled: true,
      low: 50,
      mid: 50,
      high: 50
    },
    reverb: {
      enabled: true,
      amount: 30,
      size: 50
    },
    compression: {
      enabled: false,
      threshold: 70,
      ratio: 40
    }
  });
  
  const updateEffect = (effect: string, param: string, value: number) => {
    setEffects(prev => ({
      ...prev,
      [effect]: {
        ...prev[effect as keyof typeof prev],
        [param]: value
      }
    }));
  };
  
  const toggleEffect = (effect: string) => {
    setEffects(prev => ({
      ...prev,
      [effect]: {
        ...prev[effect as keyof typeof prev],
        enabled: !prev[effect as keyof typeof prev].enabled
      }
    }));
  };
  
  return (
    <div className="space-y-4">
      <div className="glass-card p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">EQ</h3>
          <Switch 
            checked={effects.eq.enabled} 
            onCheckedChange={() => toggleEffect('eq')} 
            className="data-[state=checked]:bg-cyber-purple"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Low</span>
            <Slider 
              disabled={!effects.eq.enabled}
              value={[effects.eq.low]} 
              max={100} 
              step={1} 
              className="w-32"
              onValueChange={(value) => updateEffect('eq', 'low', value[0])}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Mid</span>
            <Slider 
              disabled={!effects.eq.enabled}
              value={[effects.eq.mid]} 
              max={100} 
              step={1} 
              className="w-32" 
              onValueChange={(value) => updateEffect('eq', 'mid', value[0])}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">High</span>
            <Slider 
              disabled={!effects.eq.enabled}
              value={[effects.eq.high]} 
              max={100} 
              step={1} 
              className="w-32" 
              onValueChange={(value) => updateEffect('eq', 'high', value[0])}
            />
          </div>
        </div>
      </div>
      
      <div className="glass-card p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Reverb</h3>
          <Switch 
            checked={effects.reverb.enabled} 
            onCheckedChange={() => toggleEffect('reverb')} 
            className="data-[state=checked]:bg-cyber-purple"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Amount</span>
            <Slider 
              disabled={!effects.reverb.enabled}
              value={[effects.reverb.amount]} 
              max={100} 
              step={1} 
              className="w-32" 
              onValueChange={(value) => updateEffect('reverb', 'amount', value[0])}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Size</span>
            <Slider 
              disabled={!effects.reverb.enabled}
              value={[effects.reverb.size]} 
              max={100} 
              step={1} 
              className="w-32" 
              onValueChange={(value) => updateEffect('reverb', 'size', value[0])}
            />
          </div>
        </div>
      </div>
      
      <div className="glass-card p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Compression</h3>
          <Switch 
            checked={effects.compression.enabled} 
            onCheckedChange={() => toggleEffect('compression')} 
            className="data-[state=checked]:bg-cyber-purple"
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Threshold</span>
            <Slider 
              disabled={!effects.compression.enabled}
              value={[effects.compression.threshold]} 
              max={100} 
              step={1} 
              className="w-32" 
              onValueChange={(value) => updateEffect('compression', 'threshold', value[0])}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Ratio</span>
            <Slider 
              disabled={!effects.compression.enabled}
              value={[effects.compression.ratio]} 
              max={100} 
              step={1} 
              className="w-32" 
              onValueChange={(value) => updateEffect('compression', 'ratio', value[0])}
            />
          </div>
        </div>
      </div>
      
      <div className="p-3 mt-4">
        <div className="flex space-x-2">
          <Button className="w-full text-sm bg-cyber-darker hover:bg-cyber-darker/80 border border-cyber-purple/30">
            Save Preset
          </Button>
          <Button className="w-full text-sm bg-cyber-darker hover:bg-cyber-darker/80 border border-cyber-purple/30">
            Load Preset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EffectsPanel;
