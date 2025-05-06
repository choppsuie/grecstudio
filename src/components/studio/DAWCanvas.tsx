
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MIDIKeyboardPanel from "./MIDIKeyboardPanel";
import MelodicPatternRecorder from "./MelodicPatternRecorder";
import DrumPads from "../midi/DrumPads";
import EffectsPanel from "./EffectsPanel";
import { useStudio } from "@/contexts/StudioHooks";

const DAWCanvas = () => {
  const { isPlaying, isRecording } = useStudio();
  
  return (
    <div className="flex-1 p-4 overflow-auto bg-cyber-darker">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-cyber-purple mb-2">Instruments & Controls</h2>
        
        <Tabs defaultValue="keyboard" className="w-full">
          <TabsList className="mb-2 bg-cyber-dark">
            <TabsTrigger value="keyboard">Melodic Keyboard</TabsTrigger>
            <TabsTrigger value="drums">Drum Machine</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
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
