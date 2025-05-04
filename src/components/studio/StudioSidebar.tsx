
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sliders, Music, Layers, MicIcon } from "lucide-react";
import PluginsPanel from './PluginsPanel';
import DrumPads from '../midi/DrumPads';
import MIDIKeyboardPanel from './MIDIKeyboardPanel';
import MelodicPatternRecorder from './MelodicPatternRecorder';
import { useProject } from '@/contexts/StudioHooks';

const StudioSidebar = () => {
  const { showMixer } = useProject();
  const [activeTab, setActiveTab] = useState("plugins");
  
  if (!showMixer) return null;
  
  return (
    <div className="w-80 min-w-80 border-l border-cyber-purple/20 bg-cyber-darker overflow-y-auto">
      <Tabs 
        defaultValue="plugins" 
        className="h-full flex flex-col"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="flex justify-between bg-cyber-dark p-1 rounded-none border-b border-cyber-purple/20">
          <TabsTrigger 
            value="plugins" 
            className="flex items-center gap-1 data-[state=active]:bg-cyber-purple/20"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span className="text-xs">Plugins</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="drums"
            className="flex items-center gap-1 data-[state=active]:bg-cyber-purple/20"
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="text-xs">Drums</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="keys"
            className="flex items-center gap-1 data-[state=active]:bg-cyber-purple/20"
          >
            <Music className="h-3.5 w-3.5" />
            <span className="text-xs">Keys</span>
          </TabsTrigger>

          <TabsTrigger 
            value="melody"
            className="flex items-center gap-1 data-[state=active]:bg-cyber-purple/20"
          >
            <MicIcon className="h-3.5 w-3.5" />
            <span className="text-xs">Recorder</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 p-3 overflow-y-auto">
          <TabsContent value="plugins" className="h-full mt-0">
            <PluginsPanel />
          </TabsContent>
          
          <TabsContent value="drums" className="h-full mt-0">
            <DrumPads />
          </TabsContent>
          
          <TabsContent value="keys" className="h-full mt-0">
            <MIDIKeyboardPanel />
          </TabsContent>

          <TabsContent value="melody" className="h-full mt-0">
            <MelodicPatternRecorder />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default StudioSidebar;
