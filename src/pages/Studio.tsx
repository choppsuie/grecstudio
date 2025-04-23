
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import TrackList from "@/components/TrackList";
import MixerControls from "@/components/MixerControls";
import AudioEngine from "@/components/AudioEngine";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Users, Mic, Music, Brain } from "lucide-react";
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
import * as Tone from "tone";

const Studio = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const { tracks, updateTrack, addTrack } = useTrackManager();
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [rightPanelTab, setRightPanelTab] = useState("effects");
  const [drawerTab, setDrawerTab] = useState<string>("midi");
  const [projectId, setProjectId] = useState("demo-project");
  const [toneInitialized, setToneInitialized] = useState(false);
  
  // Initialize Tone.js on first user interaction
  const initializeTone = async () => {
    if (!toneInitialized) {
      await Tone.start();
      setToneInitialized(true);
      console.log("Tone.js initialized");
    }
  };
  
  // Fetch current project and collaborators
  useEffect(() => {
    if (user) {
      // In a real implementation, we would fetch the current project
      // and its collaborators based on project ID from the URL
      
      // Mock collaborators for now
      setCollaborators([
        { id: '1', name: 'Alice Cooper', avatar: '', status: 'online' },
        { id: '2', name: 'Bob Dylan', avatar: '', status: 'offline' },
      ]);
      
      // Set up real-time presence with Supabase
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
  };
  
  const handlePause = () => setIsPlaying(false);
  
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your project.",
        variant: "destructive"
      });
      return;
    }
    
    // In a complete implementation, we would save the project to Supabase
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
  
  // Handle MIDI note events
  const handleMIDINoteOn = (note: number, velocity: number) => {
    console.log(`MIDI Note On: ${note}, velocity: ${velocity}`);
    // You would typically use this to trigger synths or record MIDI data
  };
  
  const handleMIDINoteOff = (note: number) => {
    console.log(`MIDI Note Off: ${note}`);
  };
  
  // Handle AI-generated content
  const handleGeneratedChordProgression = (chords: string[]) => {
    console.log("Generated chord progression:", chords);
    // In a full implementation, you would use these chords to create/update tracks
    toast({
      title: "Chord Progression Generated",
      description: `Applied progression: ${chords.join(' - ')}`,
    });
  };
  
  const handleGeneratedMelody = (notes: string[]) => {
    console.log("Generated melody:", notes);
    // In a full implementation, you would use these notes to create/update tracks
    toast({
      title: "Melody Generated",
      description: `Applied ${notes.length} notes to the project`,
    });
  };
  
  const handleRecordingComplete = (blob: Blob, duration: number) => {
    console.log(`Recording complete: ${duration.toFixed(1)}s`);
    // In a full implementation, you would upload this to your storage
    // and create a new track with the recording
  };
  
  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col">
      <Navbar />
      <AudioEngine isPlaying={isPlaying} tracks={tracks} />
      
      <div className="flex-1 pt-16 flex flex-col">
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left Sidebar - Track Controls */}
          <div className="w-full lg:w-1/4 p-4 bg-cyber-darker border-r border-cyber-purple/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Tracks</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-cyber-purple hover:bg-cyber-purple/10"
                onClick={addTrack}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            <TrackList tracks={tracks} onTrackUpdate={updateTrack} />
            
            {/* Mobile-only Drawer for Advanced Features */}
            <div className="lg:hidden mt-4">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className="w-full bg-cyber-purple hover:bg-cyber-purple/80">
                    <Brain className="mr-2 h-4 w-4" />
                    Advanced Features
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-cyber-darker text-white p-4 max-h-[80vh]">
                  <Tabs defaultValue="midi" value={drawerTab} onValueChange={setDrawerTab}>
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="midi">
                        <Music className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="voice">
                        <Mic className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="ai">
                        <Brain className="h-4 w-4" />
                      </TabsTrigger>
                      <TabsTrigger value="record">
                        <Mic className="h-4 w-4" />
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="midi">
                      <MIDIController 
                        onNoteOn={handleMIDINoteOn}
                        onNoteOff={handleMIDINoteOff}
                      />
                    </TabsContent>
                    
                    <TabsContent value="voice">
                      <VoiceChat projectId={projectId} />
                    </TabsContent>
                    
                    <TabsContent value="ai">
                      <AIAssistant 
                        onGenerateProgression={handleGeneratedChordProgression}
                        onGenerateMelody={handleGeneratedMelody}
                      />
                    </TabsContent>
                    
                    <TabsContent value="record">
                      <AudioRecorder 
                        projectId={projectId}
                        onRecordingComplete={handleRecordingComplete}
                      />
                    </TabsContent>
                  </Tabs>
                </DrawerContent>
              </Drawer>
            </div>
            
            {/* Desktop Advanced Features */}
            <div className="hidden lg:block space-y-4 mt-6">
              <MIDIController 
                onNoteOn={handleMIDINoteOn}
                onNoteOff={handleMIDINoteOff}
              />
              
              <AudioRecorder 
                projectId={projectId}
                onRecordingComplete={handleRecordingComplete}
              />
            </div>
          </div>
          
          {/* Main Content - Timeline and Waveforms */}
          <div className="flex-1 flex flex-col">
            <ProjectHeader 
              onOpenCommentsPanel={() => setRightPanelTab("chat")}
              onOpenCollaboratorsPanel={() => setRightPanelTab("collaborators")}
              onOpenSettingsPanel={() => toast({ title: "Project Settings", description: "Settings panel will be available in the next update." })}
            />
            
            {/* Timeline and Waveform Area */}
            <div className="flex-1 p-4 relative">
              <TimelineRuler />
              <TrackTimeline tracks={tracks} isPlaying={isPlaying} />
            </div>
            
            <MixerControls 
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onSave={handleSave}
              onShare={handleShare}
            />
          </div>
          
          {/* Right Sidebar - Details, Effects, Chat, and Collaborators */}
          <div className="w-full lg:w-1/4 p-4 bg-cyber-darker border-l border-cyber-purple/20 hidden lg:block">
            <Tabs value={rightPanelTab} onValueChange={setRightPanelTab}>
              <TabsList className="w-full grid grid-cols-4 mb-4">
                <TabsTrigger value="effects">Effects</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="chat">
                  <MessageSquare className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="collaborators">
                  <Users className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="effects">
                <EffectsPanel />
              </TabsContent>
              
              <TabsContent value="notes">
                <NotesPanel 
                  onSubmitNotes={() => toast({ title: "Notes saved", description: "Your project notes have been saved." })}
                  onInvite={() => toast({ title: "Invite sent", description: "Collaboration invite has been sent." })}
                />
              </TabsContent>
              
              <TabsContent value="chat" className="h-[calc(100vh-210px)]">
                <Chat user={user} />
              </TabsContent>
              
              <TabsContent value="collaborators">
                <CollaboratorsList collaborators={collaborators} />
              </TabsContent>
              
              <TabsContent value="voice">
                <VoiceChat projectId={projectId} />
              </TabsContent>
              
              <TabsContent value="ai">
                <AIAssistant 
                  onGenerateProgression={handleGeneratedChordProgression}
                  onGenerateMelody={handleGeneratedMelody}
                />
              </TabsContent>
            </Tabs>
            
            {/* Additional Advanced Features for Desktop */}
            <div className="mt-4 pt-4 border-t border-cyber-purple/20">
              <Button 
                variant="outline" 
                className="w-full border-cyber-purple/30 hover:bg-cyber-purple/10 mb-2"
                onClick={() => setRightPanelTab("voice")}
              >
                <Mic className="mr-2 h-4 w-4" /> 
                Voice Chat
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-cyber-purple/30 hover:bg-cyber-purple/10"
                onClick={() => setRightPanelTab("ai")}
              >
                <Brain className="mr-2 h-4 w-4" /> 
                AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
