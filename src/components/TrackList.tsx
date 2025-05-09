
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Volume2, Mic, Music, PlayCircle, PauseCircle, Headphones, ChevronDown, ChevronRight } from "lucide-react";
import { Track } from "@/hooks/useTrackManager";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AutomationLane from "./studio/AutomationLane";
import AuxSendPanel from "./studio/AuxSendPanel";

interface TrackListProps {
  tracks: Track[];
  onTrackUpdate?: (track: Track) => void;
}

const TrackList = ({ tracks, onTrackUpdate }: TrackListProps) => {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [expandedTracks, setExpandedTracks] = useState<Record<string, boolean>>({});
  const [showAutomation, setShowAutomation] = useState<Record<string, string>>({});
  
  // Mock data for aux sends
  const [trackSends, setTrackSends] = useState<Record<string, Array<{id: string, name: string, level: number}>>>({});
  const availableBuses = [
    { id: 'reverb', name: 'Reverb' },
    { id: 'delay', name: 'Delay' },
    { id: 'chorus', name: 'Chorus' },
    { id: 'master', name: 'Master' }
  ];
  
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
  
  const toggleTrackExpanded = (trackId: string) => {
    setExpandedTracks(prev => ({
      ...prev,
      [trackId]: !prev[trackId]
    }));
  };
  
  const toggleAutomation = (trackId: string, paramType: string) => {
    setShowAutomation(prev => {
      if (prev[trackId] === paramType) {
        // Toggle off if already showing this parameter
        const newState = {...prev};
        delete newState[trackId];
        return newState;
      }
      return {
        ...prev,
        [trackId]: paramType
      };
    });
  };
  
  const handleAutomationChange = (trackId: string, parameter: string, points: any[]) => {
    console.log(`Automation updated for track ${trackId}, parameter ${parameter}:`, points);
    // Here you would save the automation data to your state management
  };
  
  const addSend = (trackId: string, busId: string) => {
    const busInfo = availableBuses.find(b => b.id === busId);
    if (!busInfo) return;
    
    setTrackSends(prev => ({
      ...prev,
      [trackId]: [
        ...(prev[trackId] || []),
        { id: busId, name: busInfo.name, level: 50 }
      ]
    }));
  };
  
  const removeSend = (trackId: string, busId: string) => {
    setTrackSends(prev => ({
      ...prev,
      [trackId]: (prev[trackId] || []).filter(send => send.id !== busId)
    }));
  };
  
  const updateSendLevel = (trackId: string, busId: string, level: number) => {
    setTrackSends(prev => ({
      ...prev,
      [trackId]: (prev[trackId] || []).map(send => 
        send.id === busId ? { ...send, level } : send
      )
    }));
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
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 mr-1"
              onClick={() => toggleTrackExpanded(track.id)}
            >
              {expandedTracks[track.id] ? 
                <ChevronDown className="h-3 w-3" /> : 
                <ChevronRight className="h-3 w-3" />
              }
            </Button>
            
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
          
          {/* Expanded track section with automation and sends - ProTools style */}
          {expandedTracks[track.id] && (
            <div className="ml-7 mt-1 space-y-2 mb-2">
              {/* Automation controls */}
              <div className="flex space-x-1">
                <Button
                  variant={showAutomation[track.id] === 'volume' ? "default" : "outline"}
                  size="sm"
                  className="h-6 text-[10px] py-0 px-2"
                  onClick={() => toggleAutomation(track.id, 'volume')}
                >
                  Volume
                </Button>
                <Button
                  variant={showAutomation[track.id] === 'pan' ? "default" : "outline"}
                  size="sm"
                  className="h-6 text-[10px] py-0 px-2"
                  onClick={() => toggleAutomation(track.id, 'pan')}
                >
                  Pan
                </Button>
                {track.type === "midi" && (
                  <Button
                    variant={showAutomation[track.id] === 'cutoff' ? "default" : "outline"}
                    size="sm"
                    className="h-6 text-[10px] py-0 px-2"
                    onClick={() => toggleAutomation(track.id, 'cutoff')}
                  >
                    Cutoff
                  </Button>
                )}
              </div>
              
              {/* Show automation lane if selected */}
              {showAutomation[track.id] === 'volume' && (
                <AutomationLane 
                  trackId={track.id}
                  parameter="Volume"
                  height={70}
                  color={track.color}
                  min={0}
                  max={100}
                  initialPoints={[
                    { time: 0, value: track.volume },
                    { time: 8, value: track.volume * 0.8 },
                    { time: 12, value: track.volume }
                  ]}
                  onChange={(points) => handleAutomationChange(track.id, 'volume', points)}
                />
              )}
              
              {showAutomation[track.id] === 'pan' && (
                <AutomationLane 
                  trackId={track.id}
                  parameter="Pan"
                  height={70}
                  color="#1EAEDB"
                  min={-1}
                  max={1}
                  initialPoints={[
                    { time: 0, value: 0 },
                    { time: 4, value: -0.5 },
                    { time: 8, value: 0.5 },
                    { time: 12, value: 0 }
                  ]}
                  onChange={(points) => handleAutomationChange(track.id, 'pan', points)}
                />
              )}
              
              {showAutomation[track.id] === 'cutoff' && (
                <AutomationLane 
                  trackId={track.id}
                  parameter="Cutoff"
                  height={70}
                  color="#ED213A"
                  min={200}
                  max={20000}
                  initialPoints={[
                    { time: 0, value: 1000 },
                    { time: 4, value: 5000 },
                    { time: 8, value: 12000 },
                    { time: 12, value: 1000 }
                  ]}
                  onChange={(points) => handleAutomationChange(track.id, 'cutoff', points)}
                />
              )}
              
              {/* Sends panel - ProTools style */}
              <AuxSendPanel
                trackId={track.id}
                sends={trackSends[track.id] || []}
                availableBuses={availableBuses}
                onAddSend={addSend}
                onRemoveSend={removeSend}
                onSendLevelChange={updateSendLevel}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrackList;
