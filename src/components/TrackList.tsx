import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Volume2, Mic, MusicIcon, PlayCircle, PauseCircle } from "lucide-react";
import { Track } from "@/hooks/useTrackManager";
import { cn } from "@/lib/utils";

interface TrackListProps {
  tracks: Track[];
  onTrackUpdate?: (track: Track) => void;
}

const TrackList = ({ tracks, onTrackUpdate }: TrackListProps) => {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  
  const handleVolumeChange = (trackId: string, value: number[]) => {
    const track = tracks.find(t => t.id === trackId);
    if (track && onTrackUpdate) {
      onTrackUpdate({ ...track, volume: value[0] });
    }
  };
  
  const handleMuteToggle = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track && onTrackUpdate) {
      onTrackUpdate({ ...track, muted: !track.muted });
    }
  };
  
  const handleSoloToggle = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track && onTrackUpdate) {
      onTrackUpdate({ ...track, soloed: !track.soloed });
    }
  };
  
  const togglePlayPause = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
    }
  };
  
  const getTrackIcon = (type: string) => {
    switch (type) {
      case "vocal":
        return <Mic className="h-4 w-4" />;
      case "midi":
        return <MusicIcon className="h-4 w-4" />;
      default:
        return <Volume2 className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="w-full">
      {tracks.map((track) => (
        <div 
          key={track.id}
          className={cn(
            "track-row flex items-center p-3 mb-1 rounded-lg",
            track.muted && "opacity-60"
          )}
        >
          <button
            onClick={() => togglePlayPause(track.id)}
            className="mr-3 text-white hover:text-cyber-purple transition-colors"
          >
            {playingTrack === track.id ? 
              <PauseCircle className="h-6 w-6" /> : 
              <PlayCircle className="h-6 w-6" />
            }
          </button>
          
          <div 
            className="flex items-center justify-center w-8 h-8 rounded-md mr-3"
            style={{ backgroundColor: track.color + "40" }} // Adding transparency
          >
            <span className="text-white">{getTrackIcon(track.type)}</span>
          </div>
          
          <div className="flex-1 mr-4">
            <p className="text-sm font-medium text-white">{track.name}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-24">
              <Slider 
                value={[track.volume]} 
                min={0} 
                max={100} 
                step={1}
                onValueChange={(value) => handleVolumeChange(track.id, value)}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleMuteToggle(track.id)}
                className={cn(
                  "px-2 py-1 text-xs rounded-md",
                  track.muted ? "bg-cyber-purple/60 text-white" : "bg-cyber-darker text-white/70"
                )}
              >
                M
              </button>
              <button 
                onClick={() => handleSoloToggle(track.id)}
                className={cn(
                  "px-2 py-1 text-xs rounded-md",
                  track.soloed ? "bg-cyber-blue/60 text-white" : "bg-cyber-darker text-white/70"  
                )}
              >
                S
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
