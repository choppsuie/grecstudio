import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import TrackList, { Track } from "@/components/TrackList";
import MixerControls from "@/components/MixerControls";
import AudioEngine from "@/components/AudioEngine";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

import ProjectHeader from "@/components/studio/ProjectHeader";
import TimelineRuler from "@/components/studio/TimelineRuler";
import TrackTimeline from "@/components/studio/TrackTimeline";
import EffectsPanel from "@/components/studio/EffectsPanel";
import NotesPanel from "@/components/studio/NotesPanel";

const Studio = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: "1",
      name: "Drums",
      type: "audio",
      volume: 75,
      muted: false,
      soloed: false,
      color: "#8B5CF6" // cyber-purple
    },
    {
      id: "2",
      name: "Bass",
      type: "audio",
      volume: 80,
      muted: false,
      soloed: false,
      color: "#1EAEDB" // cyber-blue
    },
    {
      id: "3",
      name: "Synth Lead",
      type: "midi",
      volume: 65,
      muted: false,
      soloed: false,
      color: "#33C3F0" // cyber-cyan
    },
    {
      id: "4",
      name: "Vocals",
      type: "vocal",
      volume: 90,
      muted: false,
      soloed: false,
      color: "#D6BCFA" // cyber-light-purple
    }
  ]);
  
  const handleTrackUpdate = (updatedTrack: Track) => {
    setTracks(tracks.map(track => 
      track.id === updatedTrack.id ? updatedTrack : track
    ));
  };
  
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const handleAddTrack = () => {
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      name: `Track ${tracks.length + 1}`,
      type: "audio",
      volume: 75,
      muted: false,
      soloed: false,
      color: "#ED213A" // cyber-red
    };
    
    setTracks([...tracks, newTrack]);
    toast({
      title: "Track added",
      description: `Added new track: ${newTrack.name}`,
    });
  };
  
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
                onClick={handleAddTrack}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            <TrackList tracks={tracks} onTrackUpdate={handleTrackUpdate} />
          </div>
          
          {/* Main Content - Timeline and Waveforms */}
          <div className="flex-1 flex flex-col">
            <ProjectHeader 
              onOpenCommentsPanel={openCommentsPanel}
              onOpenCollaboratorsPanel={openCollaboratorsPanel}
              onOpenSettingsPanel={openSettingsPanel}
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
                  onSubmitNotes={handleSubmitNotes}
                  onInvite={handleInvite}
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
