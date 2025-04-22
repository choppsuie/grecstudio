
import { Slider } from "@/components/ui/slider";

const EffectsPanel = () => {
  return (
    <div className="space-y-4">
      <div className="glass-card p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">EQ</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Low</span>
            <Slider defaultValue={[50]} max={100} step={1} className="w-32" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Mid</span>
            <Slider defaultValue={[50]} max={100} step={1} className="w-32" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">High</span>
            <Slider defaultValue={[50]} max={100} step={1} className="w-32" />
          </div>
        </div>
      </div>
      
      <div className="glass-card p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Reverb</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Amount</span>
            <Slider defaultValue={[30]} max={100} step={1} className="w-32" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Size</span>
            <Slider defaultValue={[50]} max={100} step={1} className="w-32" />
          </div>
        </div>
      </div>
      
      <div className="glass-card p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Compression</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Threshold</span>
            <Slider defaultValue={[70]} max={100} step={1} className="w-32" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">Ratio</span>
            <Slider defaultValue={[40]} max={100} step={1} className="w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EffectsPanel;
