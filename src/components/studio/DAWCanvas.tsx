
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MIDIKeyboardPanel from "./MIDIKeyboardPanel";
import MelodicPatternRecorder from "./MelodicPatternRecorder";
import DrumPads from "../midi/DrumPads";
import EffectsPanel from "./EffectsPanel";
import MixerEffectsRack from './MixerEffectsRack';
import SampleBrowser from './SampleBrowser';
import { useStudio } from "@/contexts/StudioHooks";
import { Button } from '@/components/ui/button';
import { Disc, Music, Sliders, AudioWaveform } from 'lucide-react';

const DAWCanvas = () => {
  const { isPlaying, isRecording } = useStudio();
  const [activeView, setActiveView] = useState<'standard' | 'advanced'>('standard');
  
  return (
    <div className="flex-1 p-4 overflow-auto bg-cyber-darker">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-cyber-purple">Instruments & Controls</h2>
          <div className="flex space-x-2">
            <Button 
              variant={activeView === 'standard' ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setActiveView('standard')}
            >
              Standard View
            </Button>
            <Button 
              variant={activeView === 'advanced' ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setActiveView('advanced')}
            >
              Advanced View
            </Button>
          </div>
        </div>
        
        {activeView === 'standard' ? (
          <Tabs defaultValue="keyboard" className="w-full">
            <TabsList className="mb-2 bg-cyber-dark">
              <TabsTrigger value="keyboard">
                <Music className="h-4 w-4 mr-2" />
                Melodic Keyboard
              </TabsTrigger>
              <TabsTrigger value="drums">
                <Disc className="h-4 w-4 mr-2" />
                Drum Machine
              </TabsTrigger>
              <TabsTrigger value="effects">
                <Sliders className="h-4 w-4 mr-2" />
                Effects
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="keyboard" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <MIDIKeyboardPanel />
                <MelodicPatternRecorder />
              </div>
            </TabsContent>
            
            <TabsContent value="drums">
              <DrumPads />
            </TabsContent>
            
            <TabsContent value="effects">
              <EffectsPanel />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-4">
                <MIDIKeyboardPanel />
                <MixerEffectsRack />
              </div>
              <div className="flex flex-col space-y-4">
                <Tabs defaultValue="drums" className="w-full">
                  <TabsList className="mb-2 bg-cyber-dark">
                    <TabsTrigger value="drums">
                      <Disc className="h-4 w-4 mr-2" />
                      Drums
                    </TabsTrigger>
                    <TabsTrigger value="samples">
                      <AudioWaveform className="h-4 w-4 mr-2" />
                      Samples
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="drums" className="h-[400px]">
                    <DrumPads />
                  </TabsContent>
                  
                  <TabsContent value="samples" className="h-[400px]">
                    <SampleBrowser />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className={`flex items-center justify-center py-4 ${isRecording ? 'animate-pulse' : ''}`}>
        {isRecording && (
          <div className="bg-cyber-red/20 text-cyber-red px-4 py-2 rounded-lg border border-cyber-red flex items-center">
            <span className="h-3 w-3 bg-cyber-red rounded-full mr-2 animate-pulse"></span>
            Recording In Progress
          </div>
        )}
      </div>
    </div>
  );
};

export default DAWCanvas;
