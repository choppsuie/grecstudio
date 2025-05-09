
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Music, Volume2, Sliders, Disc, AudioWaveform, WaveSine } from 'lucide-react';
import { cn } from "@/lib/utils";

interface MixerEffectsRackProps {
  className?: string;
}

const MixerEffectsRack: React.FC<MixerEffectsRackProps> = ({ className }) => {
  const [reverbMix, setReverbMix] = useState(20);
  const [reverbDecay, setReverbDecay] = useState(3);
  const [delayTime, setDelayTime] = useState(0.25);
  const [delayFeedback, setDelayFeedback] = useState(30);
  const [eqLow, setEqLow] = useState(0);
  const [eqMid, setEqMid] = useState(0);
  const [eqHigh, setEqHigh] = useState(0);
  const [compThreshold, setCompThreshold] = useState(-20);
  const [compRatio, setCompRatio] = useState(4);
  const [compAttack, setCompAttack] = useState(0.2);
  const [compRelease, setCompRelease] = useState(0.5);

  return (
    <div className={cn("bg-cyber-darker border border-cyber-purple/20 rounded-md overflow-hidden shadow-xl", className)}>
      <Tabs defaultValue="eq" className="w-full">
        <TabsList className="grid grid-cols-4 h-10 rounded-none bg-cyber-dark">
          <TabsTrigger value="eq" className="data-[state=active]:bg-cyber-purple/20 h-10 rounded-none data-[state=active]:text-white">
            <Sliders className="h-4 w-4 mr-2" />
            EQ
          </TabsTrigger>
          <TabsTrigger value="dynamics" className="data-[state=active]:bg-cyber-purple/20 h-10 rounded-none data-[state=active]:text-white">
            <AudioWaveform className="h-4 w-4 mr-2" />
            Dynamics
          </TabsTrigger>
          <TabsTrigger value="reverb" className="data-[state=active]:bg-cyber-purple/20 h-10 rounded-none data-[state=active]:text-white">
            <Music className="h-4 w-4 mr-2" />
            Reverb
          </TabsTrigger>
          <TabsTrigger value="delay" className="data-[state=active]:bg-cyber-purple/20 h-10 rounded-none data-[state=active]:text-white">
            <Disc className="h-4 w-4 mr-2" />
            Delay
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="eq" className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eq-low" className="text-cyber-text-muted text-xs">Low (100Hz)</Label>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-cyber-text mb-1">{eqLow > 0 ? `+${eqLow}` : eqLow} dB</span>
                  <Slider
                    id="eq-low"
                    orientation="vertical"
                    min={-12}
                    max={12}
                    step={1}
                    value={[eqLow]}
                    onValueChange={(value) => setEqLow(value[0])}
                    className="h-32"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eq-mid" className="text-cyber-text-muted text-xs">Mid (1kHz)</Label>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-cyber-text mb-1">{eqMid > 0 ? `+${eqMid}` : eqMid} dB</span>
                  <Slider
                    id="eq-mid"
                    orientation="vertical"
                    min={-12}
                    max={12}
                    step={1}
                    value={[eqMid]}
                    onValueChange={(value) => setEqMid(value[0])}
                    className="h-32"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eq-high" className="text-cyber-text-muted text-xs">High (10kHz)</Label>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-cyber-text mb-1">{eqHigh > 0 ? `+${eqHigh}` : eqHigh} dB</span>
                  <Slider
                    id="eq-high"
                    orientation="vertical"
                    min={-12}
                    max={12}
                    step={1}
                    value={[eqHigh]}
                    onValueChange={(value) => setEqHigh(value[0])}
                    className="h-32"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between items-center">
              <Select defaultValue="parametric">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="EQ Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parametric">Parametric EQ</SelectItem>
                  <SelectItem value="graphic">10-Band Graphic</SelectItem>
                  <SelectItem value="vintage">Vintage EQ</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Switch id="eq-bypass" />
                <Label htmlFor="eq-bypass" className="text-cyber-text-muted text-xs">Bypass</Label>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="dynamics" className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="comp-threshold" className="text-cyber-text-muted text-xs">Threshold</Label>
                <div className="space-y-1">
                  <span className="text-xs text-cyber-text">{compThreshold} dB</span>
                  <Slider
                    id="comp-threshold"
                    min={-60}
                    max={0}
                    step={1}
                    value={[compThreshold]}
                    onValueChange={(value) => setCompThreshold(value[0])}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comp-ratio" className="text-cyber-text-muted text-xs">Ratio</Label>
                <div className="space-y-1">
                  <span className="text-xs text-cyber-text">{compRatio}:1</span>
                  <Slider
                    id="comp-ratio"
                    min={1}
                    max={20}
                    step={0.1}
                    value={[compRatio]}
                    onValueChange={(value) => setCompRatio(value[0])}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comp-attack" className="text-cyber-text-muted text-xs">Attack</Label>
                <div className="space-y-1">
                  <span className="text-xs text-cyber-text">{compAttack.toFixed(2)} ms</span>
                  <Slider
                    id="comp-attack"
                    min={0.1}
                    max={1}
                    step={0.01}
                    value={[compAttack]}
                    onValueChange={(value) => setCompAttack(value[0])}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comp-release" className="text-cyber-text-muted text-xs">Release</Label>
                <div className="space-y-1">
                  <span className="text-xs text-cyber-text">{compRelease.toFixed(2)} s</span>
                  <Slider
                    id="comp-release"
                    min={0.1}
                    max={2}
                    step={0.01}
                    value={[compRelease]}
                    onValueChange={(value) => setCompRelease(value[0])}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-cyber-purple/10 flex justify-between items-center">
              <Select defaultValue="compressor">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Processor Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compressor">Compressor</SelectItem>
                  <SelectItem value="limiter">Limiter</SelectItem>
                  <SelectItem value="gate">Noise Gate</SelectItem>
                  <SelectItem value="multiband">Multiband Comp</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Switch id="comp-bypass" />
                <Label htmlFor="comp-bypass" className="text-cyber-text-muted text-xs">Bypass</Label>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reverb" className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reverb-mix" className="text-cyber-text-muted text-xs">Mix</Label>
                <div className="space-y-1">
                  <span className="text-xs text-cyber-text">{reverbMix}%</span>
                  <Slider
                    id="reverb-mix"
                    min={0}
                    max={100}
                    step={1}
                    value={[reverbMix]}
                    onValueChange={(value) => setReverbMix(value[0])}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reverb-decay" className="text-cyber-text-muted text-xs">Decay</Label>
                <div className="space-y-1">
                  <span className="text-xs text-cyber-text">{reverbDecay.toFixed(1)} s</span>
                  <Slider
                    id="reverb-decay"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={[reverbDecay]}
                    onValueChange={(value) => setReverbDecay(value[0])}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Select defaultValue="hall">
                <SelectTrigger>
                  <SelectValue placeholder="Reverb Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hall">Concert Hall</SelectItem>
                  <SelectItem value="room">Small Room</SelectItem>
                  <SelectItem value="plate">Plate</SelectItem>
                  <SelectItem value="cathedral">Cathedral</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Room Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 flex justify-between items-center">
              <Button variant="outline" size="sm">Load Preset</Button>
              
              <div className="flex items-center space-x-2">
                <Switch id="reverb-bypass" />
                <Label htmlFor="reverb-bypass" className="text-cyber-text-muted text-xs">Bypass</Label>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="delay" className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="delay-time" className="text-cyber-text-muted text-xs">Time</Label>
                <div className="space-y-1">
                  <span className="text-xs text-cyber-text">{delayTime.toFixed(2)} s</span>
                  <Slider
                    id="delay-time"
                    min={0.01}
                    max={2}
                    step={0.01}
                    value={[delayTime]}
                    onValueChange={(value) => setDelayTime(value[0])}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delay-feedback" className="text-cyber-text-muted text-xs">Feedback</Label>
                <div className="space-y-1">
                  <span className="text-xs text-cyber-text">{delayFeedback}%</span>
                  <Slider
                    id="delay-feedback"
                    min={0}
                    max={100}
                    step={1}
                    value={[delayFeedback]}
                    onValueChange={(value) => setDelayFeedback(value[0])}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Select defaultValue="stereo">
                <SelectTrigger>
                  <SelectValue placeholder="Delay Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stereo">Stereo Delay</SelectItem>
                  <SelectItem value="pingpong">Ping Pong</SelectItem>
                  <SelectItem value="tape">Tape Echo</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="quarter">
                <SelectTrigger>
                  <SelectValue placeholder="Sync" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="eighth">1/8</SelectItem>
                  <SelectItem value="quarter">1/4</SelectItem>
                  <SelectItem value="half">1/2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 flex justify-between items-center">
              <Button variant="outline" size="sm">Save Preset</Button>
              
              <div className="flex items-center space-x-2">
                <Switch id="delay-bypass" />
                <Label htmlFor="delay-bypass" className="text-cyber-text-muted text-xs">Bypass</Label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MixerEffectsRack;
