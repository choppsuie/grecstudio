import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import TrackList from "@/components/TrackList";
import MixerControls from "@/components/MixerControls";
import AudioEngine from "@/components/AudioEngine";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Users, Mic, Music, Brain, Keyboard as LucideKeyboard, Settings, Save, Share2, Scissors, Copy, Trash2, Undo, Redo } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useToast } from "@/hooks/use-toast";
import { useTrackManager } from "@/hooks/useTrackManager";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import ProjectHeader from "@/components/studio/ProjectHeader";
import TimelineRuler from "@/components/studio/TimelineRuler";
import TrackTimeline from "@/components/studio/TrackTimeline";
import EffectsPanel from "@/components/studio/EffectsPanel";
import NotesPanel from "@/components/studio/NotesPanel";
import Chat from "@/components/studio/Chat";
import CollaboratorsList from "@/components/studio/CollaboratorsList";
import MIDIController from "@/components/midi/MIDIController";
import VoiceChat from "@/components/voice/VoiceChat";
import AIAssistant from "@/components/ai/AIAssistant";
import AudioRecorder from "@/components/audio/AudioRecorder";
import PianoKeyboard from "@/components/midi/PianoKeyboard";
import TransportControls from "@/components/studio/TransportControls";
import MarkerList from "@/components/studio/MarkerList";
import StudioMenubar from "@/components/studio/StudioMenubar";
import * as Tone from "tone";
import { cn } from "@/lib/utils";

const Studio = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { tracks, updateTrack, addTrack } = useTrackManager();
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [rightPanelTab, setRightPanelTab] = useState("effects");
  const [drawerTab, setDrawerTab] = useState<string>("midi");
  const [projectId, setProjectId] = useState("demo-project");
  const [toneInitialized, setToneInitialized] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [showMixer, setShowMixer] = useState(true);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const initializeTone = async () => {
    if (!toneInitialized) {
      await Tone.start();
      setToneInitialized(true);
      console.log("Tone.js initialized");
      Tone.Transport.bpm.value = bpm;
    }
  };
  
  useEffect(() => {
    if (user) {
      setCollaborators([
        { id: '1', name: 'Alice Cooper', avatar: '', status: 'online' },
        { id: '2', name: 'Bob Dylan', avatar: '', status: 'offline' },
      ]);
      
      const channel = supabase.channel('studio_collaboration');
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          console.log('Current collaborators:', state);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          toast({
            title: "Collaborator joined",
            description: `${newPresences[0]?.name || 'Someone'} has joined the session.`,
          });
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          toast({
            title: "Collaborator left",
            description: `${leftPresences[0]?.name || 'Someone'} has left the session.`,
          });
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED' && user) {
            await channel.track({
              userId: user.id,
              name: user.email || 'Anonymous',
              online_at: new Date().toISOString(),
            });
          }
        });
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, toast]);
  
  const handlePlay = async () => {
    await initializeTone();
    setIsPlaying(true);
    Tone.Transport.start();
  };
  
  const handlePause = () => {
    setIsPlaying(false);
    Tone.Transport.pause();
  };
  
  const handleStop = () => {
    setIsPlaying(false);
    Tone.Transport.stop();
  };
  
  const handleRecord = async () => {
    await initializeTone();
    
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (isPlaying) {
        handlePause();
      }
      toast({
        title: "Recording stopped",
        description: "Your recording has been saved.",
      });
    } else {
      // Start recording
      setIsRecording(true);
      if (!isPlaying) {
        handlePlay();
      }
      toast({
        title: "Recording started",
        description: "Recording in progress...",
        variant: "destructive"
      });
    }
  };
  
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your project.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Project saved",
      description: "All your changes have been saved to the cloud.",
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Share project",
      description: "Project link copied to clipboard. You can now share it with collaborators.",
    });
  };
  
  const handleMIDINoteOn = (note: number, velocity: number) => {
    console.log(`MIDI Note On: ${note}, velocity: ${velocity}`);
  };
  
  const handleMIDINoteOff = (note: number) => {
    console.log(`MIDI Note Off: ${note}`);
  };
  
  const handleGeneratedChordProgression = (chords: string[]) => {
    console.log("Generated chord progression:", chords);
    toast({
      title: "Chord Progression Generated",
      description: `Applied progression: ${chords.join(' - ')}`,
    });
  };
  
  const handleGeneratedMelody = (notes: string[]) => {
    console.log("Generated melody:", notes);
    toast({
      title: "Melody Generated",
      description: `Applied ${notes.length} notes to the project`,
    });
  };
  
  const handleRecordingComplete = (blob: Blob, duration: number) => {
    console.log(`Recording complete: ${duration.toFixed(1)}s`);
    setIsRecording(false);
    
    // Add a new track with the recording
    addTrack({
      name: `Recording ${new Date().toLocaleTimeString()}`,
      type: 'audio',
      color: '#F9636F',
    });
    
    toast({
      title: "Recording complete",
      description: `${duration.toFixed(1)}s audio saved to new track.`,
    });
  };
  
  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    if (toneInitialized) {
      Tone.Transport.bpm.value = newBpm;
    }
  };
  
  const toggleMixer = () => {
    setShowMixer(!showMixer);
  };
  
  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col">
      {/* Top Navigation */}
      <div className="border-b border-cyber-purple/20 bg-cyber-darker">
        <StudioMenubar />
        
        <div className="flex items-center h-10 px-2 border-t border-cyber-purple/10">
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Redo className="h-4 w-4" />
            </Button>
            <div className="h-8 border-r border-cyber-purple/20 mx-1"></div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Scissors className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="h-8 border-r border-cyber-purple/20 mx-1"></div>
            <Button 
              variant={isRecording ? "destructive" : "ghost"} 
              size="icon" 
              className={cn("h-8 w-8", isRecording && "animate-pulse")} 
              onClick={handleRecord}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="ml-auto">
            <TransportControls 
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onStop={handleStop}
              bpm={bpm}
              onBpmChange={handleBpmChange}
            />
          </div>
        </div>
      </div>
      
      <AudioEngine isPlaying={isPlaying} tracks={tracks} />
      
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
                <MixerControls 
                  isPlaying={isPlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onSave={handleSave}
                  onShare={handleShare}
                />
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
              <TabsTrigger value="notes" className="text-xs h-8">Notes</TabsTrigger>
              <TabsTrigger value="keyboard" className="text-xs h-8">Keyboard</TabsTrigger>
              <TabsTrigger value="midi" className="text-xs h-8">MIDI</TabsTrigger>
            </TabsList>
            
            <TabsContent value="markers" className="flex-1 overflow-y-auto p-2 m-0">
              <MarkerList />
            </TabsContent>
            
            <TabsContent value="effects" className="flex-1 overflow-y-auto p-2 m-0">
              <EffectsPanel />
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
            
            <TabsContent value="midi" className="flex-1 overflow-y-auto p-2 m-0">
              <MIDIController 
                onNoteOn={handleMIDINoteOn}
                onNoteOff={handleMIDINoteOff}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Audio recorder component (visible when recording) */}
      {isRecording && (
        <div className="fixed bottom-16 right-6 bg-cyber-darker border border-cyber-red/50 p-3 rounded-lg shadow-lg animate-pulse">
          <AudioRecorder 
            projectId="demo-project"
            onRecordingComplete={handleRecordingComplete} 
          />
        </div>
      )}
      
      {/* Status bar */}
      <div className="h-6 bg-cyber-darker border-t border-cyber-purple/20 px-3 flex items-center text-xs text-cyber-purple/70">
        <div className="flex-1">
          {isRecording ? (
            <span className="text-cyber-red font-medium">● Recording...</span>
          ) : (
            "Ready"
          )}
        </div>
        <div className="flex space-x-4">
          <span>48000 Hz, Stereo</span>
          <span>{bpm} BPM</span>
          <span>4/4</span>
          <span>CPU: 10%</span>
        </div>
      </div>
    </div>
  );
};

export default Studio;
