
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import TrackList, { Track } from "@/components/TrackList";
import MixerControls from "@/components/MixerControls";
import AudioVisualizer from "@/components/AudioVisualizer";
import AudioEngine from "@/components/AudioEngine";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, Pause, MusicIcon, Mic, Volume2, 
  Plus, MessageSquare, Users, Settings, Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Studio = () => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [projectNotes, setProjectNotes] = useState("");
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
        {/* Main Studio Interface */}
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
            {/* Project Header */}
            <div className="p-4 border-b border-cyber-purple/20 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Untitled Project</h1>
                <p className="text-sm text-white/60">120 BPM - 4/4 - 00:00:00</p>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:text-cyber-purple hover:bg-cyber-purple/10"
                  onClick={openCommentsPanel}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:text-cyber-purple hover:bg-cyber-purple/10"
                  onClick={openCollaboratorsPanel}
                >
                  <Users className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:text-cyber-purple hover:bg-cyber-purple/10"
                  onClick={openSettingsPanel}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Timeline and Waveform Area */}
            <div className="flex-1 p-4 relative">
              {/* Time Ruler */}
              <div className="h-8 mb-2 border-b border-cyber-purple/20 flex">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-cyber-purple/10 text-xs text-white/40 pt-1">
                    {i+1}
                  </div>
                ))}
              </div>
              
              {/* Track Waveforms */}
              <div className="flex-1">
                {tracks.map((track) => (
                  <div key={track.id} className="h-24 mb-2 border border-cyber-purple/10 rounded-md overflow-hidden">
                    <div className="h-full w-full">
                      <AudioVisualizer isPlaying={isPlaying} color={track.color} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mixer Controls */}
            <MixerControls 
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onSave={handleSave}
              onShare={handleShare}
            />
          </div>
          
          {/* Right Sidebar - Details and Effects (Collapsible on mobile) */}
          <div className="w-full lg:w-1/4 p-4 bg-cyber-darker border-l border-cyber-purple/20 hidden lg:block">
            <Tabs defaultValue="effects">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="effects">Effects</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="effects" className="space-y-4">
                <div className="glass-card p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">EQ</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Low</span>
                      <Slider 
                        defaultValue={[50]} 
                        max={100} 
                        step={1} 
                        className="w-32" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Mid</span>
                      <Slider 
                        defaultValue={[50]} 
                        max={100} 
                        step={1} 
                        className="w-32" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">High</span>
                      <Slider 
                        defaultValue={[50]} 
                        max={100} 
                        step={1} 
                        className="w-32" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Reverb</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Amount</span>
                      <Slider 
                        defaultValue={[30]} 
                        max={100} 
                        step={1} 
                        className="w-32" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Size</span>
                      <Slider 
                        defaultValue={[50]} 
                        max={100} 
                        step={1} 
                        className="w-32" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Compression</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Threshold</span>
                      <Slider 
                        defaultValue={[70]} 
                        max={100} 
                        step={1} 
                        className="w-32" 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">Ratio</span>
                      <Slider 
                        defaultValue={[40]} 
                        max={100} 
                        step={1} 
                        className="w-32" 
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notes">
                <div className="glass-card p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">Project Notes</h3>
                  <textarea 
                    className="w-full h-48 bg-cyber-darker border border-cyber-purple/20 rounded-md p-2 text-sm text-white/80 resize-none focus:outline-none focus:border-cyber-purple/50"
                    placeholder="Add notes about this project..."
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                  ></textarea>
                  <div className="mt-2 flex justify-end">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-cyber-red to-cyber-purple"
                      onClick={handleSubmitNotes}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Save Notes
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Collaborators</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center bg-cyber-darker p-2 rounded-md">
                      <div className="w-6 h-6 rounded-full bg-cyber-purple/20 flex items-center justify-center mr-2">
                        <span className="text-xs">JS</span>
                      </div>
                      <span className="text-xs">You (Owner)</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-dashed border-cyber-purple/30 text-xs"
                      onClick={handleInvite}
                    >
                      + Invite
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Studio;
