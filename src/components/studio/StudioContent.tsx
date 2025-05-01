
import React from 'react';
import { useStudio } from '@/contexts/StudioContext';
import { useTrackManager } from '@/hooks/useTrackManager';
import TrackList from '@/components/TrackList';
import TimelineRuler from '@/components/studio/TimelineRuler';
import TrackTimeline from '@/components/studio/TrackTimeline';
import MixerControls from '@/components/MixerControls';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarkerList from '@/components/studio/MarkerList';
import EffectsPanel from '@/components/studio/EffectsPanel';
import PluginsPanel from '@/components/studio/PluginsPanel';
import NotesPanel from '@/components/studio/NotesPanel';
import PianoKeyboard from '@/components/midi/piano/PianoKeyboard';
import DrumPads from '@/components/midi/DrumPads';
import MIDIController from '@/components/midi/MIDIController';
import { useToast } from '@/hooks/use-toast';

const StudioContent = () => {
  const { toast } = useToast();
  const { 
    isPlaying, 
    showMixer, 
    toggleMixer, 
    timelineRef,
    handleMIDINoteOn,
    handleMIDINoteOff,
  } = useStudio();
  
  const { tracks, updateTrack, addTrack } = useTrackManager();
  const [rightPanelTab, setRightPanelTab] = React.useState("effects");

  return (
    <div className="flex-1 flex">
      {/* Left sidebar: Track List */}
      <div className="w-56 bg-cyber-darker border-r border-cyber-purple/20 flex flex-col">
        <div className="p-2 border-b border-cyber-purple/20 flex justify-between items-center">
          <h3 className="text-sm font-bold">Tracks</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addTrack}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <TrackList tracks={tracks} onTrackUpdate={updateTrack} />
        </div>
        
        <div className="border-t border-cyber-purple/20 p-2">
          <Button variant="outline" size="sm" className="w-full" onClick={toggleMixer}>
            {showMixer ? "Hide Mixer" : "Show Mixer"}
          </Button>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Arranger View */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <TimelineRuler />
          <div className="flex-1 overflow-y-auto" ref={timelineRef}>
            <TrackTimeline tracks={tracks} isPlaying={isPlaying} />
          </div>
        </div>
        
        {/* Mixer View at the bottom */}
        {showMixer && (
          <div className="border-t border-cyber-purple/20 h-64">
            <div className="h-8 border-b border-cyber-purple/20 bg-cyber-darker/50 px-4 flex justify-between items-center">
              <span className="text-xs font-medium">Mixer</span>
              <button 
                className="text-cyber-purple/70 hover:text-cyber-purple text-xs" 
                onClick={toggleMixer}
              >
                Hide
              </button>
            </div>
            <div className="h-[calc(100%-2rem)] overflow-x-auto">
              <MixerControls isPlaying={isPlaying} />
            </div>
          </div>
        )}
      </div>
      
      {/* Right sidebar */}
      <div className="w-72 border-l border-cyber-purple/20 bg-cyber-darker flex flex-col">
        <Tabs value={rightPanelTab} onValueChange={setRightPanelTab} className="flex flex-col h-full">
          <TabsList className="w-full p-1 h-10 bg-cyber-dark gap-1">
            <TabsTrigger value="markers" className="text-xs h-8">Markers</TabsTrigger>
            <TabsTrigger value="effects" className="text-xs h-8">Effects</TabsTrigger>
            <TabsTrigger value="plugins" className="text-xs h-8">Plugins</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs h-8">Notes</TabsTrigger>
            <TabsTrigger value="keyboard" className="text-xs h-8">Keyboard</TabsTrigger>
            <TabsTrigger value="drums" className="text-xs h-8">Drums</TabsTrigger>
            <TabsTrigger value="midi" className="text-xs h-8">MIDI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="markers" className="flex-1 overflow-y-auto p-2 m-0">
            <MarkerList />
          </TabsContent>
          
          <TabsContent value="effects" className="flex-1 overflow-y-auto p-2 m-0">
            <EffectsPanel />
          </TabsContent>
          
          <TabsContent value="plugins" className="flex-1 overflow-y-auto p-2 m-0">
            <PluginsPanel />
          </TabsContent>
          
          <TabsContent value="notes" className="flex-1 overflow-y-auto p-2 m-0">
            <NotesPanel 
              onSubmitNotes={() => toast({ title: "Notes saved", description: "Your project notes have been saved." })}
              onInvite={() => toast({ title: "Invite sent", description: "Collaboration invite has been sent." })}
            />
          </TabsContent>
          
          <TabsContent value="keyboard" className="flex-1 overflow-y-auto p-2 m-0">
            <PianoKeyboard 
              onNoteOn={handleMIDINoteOn}
              onNoteOff={handleMIDINoteOff}
            />
          </TabsContent>
          
          <TabsContent value="drums" className="flex-1 overflow-y-auto p-2 m-0">
            <DrumPads />
          </TabsContent>
          
          <TabsContent value="midi" className="flex-1 overflow-y-auto p-2 m-0">
            <MIDIController 
              onNoteOn={handleMIDINoteOn}
              onNoteOff={handleMIDINoteOff}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudioContent;
