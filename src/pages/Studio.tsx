
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import TrackList from "@/components/TrackList";
import MixerControls from "@/components/MixerControls";
import AudioEngine from "@/components/AudioEngine";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Studio = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const { tracks, updateTrack, addTrack } = useTrackManager();
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [rightPanelTab, setRightPanelTab] = useState("effects");
  
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
  
  const handlePlay = () => setIsPlaying(true);
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
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
