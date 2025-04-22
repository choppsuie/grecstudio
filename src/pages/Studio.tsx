import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import TrackList from "@/components/TrackList";
import MixerControls from "@/components/MixerControls";
import AudioEngine from "@/components/AudioEngine";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useTrackManager } from "@/hooks/useTrackManager";

import ProjectHeader from "@/components/studio/ProjectHeader";
import TimelineRuler from "@/components/studio/TimelineRuler";
import TrackTimeline from "@/components/studio/TrackTimeline";
import EffectsPanel from "@/components/studio/EffectsPanel";
import NotesPanel from "@/components/studio/NotesPanel";

const Studio = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const { tracks, updateTrack, addTrack } = useTrackManager();
  
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleSave = () => {
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
  
  const handleSubmitNotes = () => {
    toast({
      title: "Notes saved",
      description: "Your project notes have been saved.",
    });
  };
  
  const handleInvite = () => {
    toast({
      title: "Invite sent",
      description: "Collaboration invite has been sent.",
    });
  };
  
  const openCommentsPanel = () => {
    toast({
      title: "Comments",
      description: "Comments panel will be available in the next update.",
    });
  };
  
  const openCollaboratorsPanel = () => {
    toast({
      title: "Collaborators",
      description: "Collaborators panel will be available in the next update.",
    });
  };
  
  const openSettingsPanel = () => {
    toast({
      title: "Project Settings",
      description: "Settings panel will be available in the next update.",
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
              onOpenCommentsPanel={() => toast({ title: "Comments", description: "Comments panel will be available in the next update." })}
              onOpenCollaboratorsPanel={() => toast({ title: "Collaborators", description: "Collaborators panel will be available in the next update." })}
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
              onShare={() => toast({ title: "Share project", description: "Project link copied to clipboard. You can now share it with collaborators." })}
            />
          </div>
          
          {/* Right Sidebar - Details and Effects */}
          <div className="w-full lg:w-1/4 p-4 bg-cyber-darker border-l border-cyber-purple/20 hidden lg:block">
            <Tabs defaultValue="effects">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="effects">Effects</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
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
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
