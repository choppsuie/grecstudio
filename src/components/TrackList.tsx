
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Volume2, Mic, Music, PlayCircle, PauseCircle, Headphones } from "lucide-react";
import { Track } from "@/hooks/useTrackManager";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
        return <Mic className="h-3 w-3" />;
      case "midi":
        return <Music className="h-3 w-3" />;
      default:
        return <Volume2 className="h-3 w-3" />;
    }
  };
  
  return (
    <div className="w-full">
      {tracks.map((track) => (
        <div 
          key={track.id}
          className={cn(
            "track-row flex flex-col p-1",
            track.muted && "opacity-60"
          )}
        >
          <div className="flex items-center p-1 bg-cyber-dark/40 rounded-t-sm">
            <div 
              className="flex items-center justify-center w-5 h-5 rounded-sm mr-1"
              style={{ backgroundColor: track.color + "40" }} // Adding transparency
            >
              {getTrackIcon(track.type)}
            </div>
            
            <div className="flex-1 mr-1">
              <p className="text-xs font-medium text-white truncate">{track.name}</p>
            </div>
            
            <button
              onClick={() => handleMuteToggle(track.id)}
              className={cn(
                "px-1 text-[10px] rounded-sm mr-1",
                track.muted ? "bg-cyber-red/60 text-white" : "bg-cyber-darker text-white/70"
              )}
            >
              M
            </button>
            
            <button
              onClick={() => handleSoloToggle(track.id)}
              className={cn(
                "px-1 text-[10px] rounded-sm",
                track.soloed ? "bg-cyber-blue/60 text-white" : "bg-cyber-darker text-white/70"  
              )}
            >
              S
            </button>
          </div>
          
          <div className="flex p-1 bg-cyber-darker">
            <div className="flex flex-col items-center w-6 mr-1 space-y-1">
              <button
                onClick={() => togglePlayPause(track.id)}
                className="text-white hover:text-cyber-purple"
              >
                {playingTrack === track.id ? 
                  <PauseCircle className="h-4 w-4" /> : 
                  <PlayCircle className="h-4 w-4" />
                }
              </button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0"
              >
                <Headphones className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div 
                className="h-8 w-full bg-cyber-dark/40 rounded-sm"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${track.color}20 1px, transparent 1px)`,
                  backgroundSize: '8px 100%'
                }}
              >
                {/* Waveform visualization placeholder */}
                <div className="h-full w-full flex items-center justify-center">
                  <div className="h-4 w-3/4 flex items-center">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 mx-px bg-cyber-purple/30"
                        style={{ 
                          height: `${Math.random() * 100}%`,
                          minWidth: '2px'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-1">
                <div className="w-24">
                  <Slider 
                    value={[track.volume]} 
                    min={0} 
                    max={100} 
                    step={1}
                    onValueChange={(value) => handleVolumeChange(track.id, value)}
                    className="w-full h-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
