
import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useToast } from '@/hooks/use-toast';
import { Marker } from '@/components/studio/MarkerEditor';

interface PlaybackContextType {
  isPlaying: boolean;
  toneInitialized: boolean;
  bpm: number;
  timelineRef: React.RefObject<HTMLDivElement>;
  currentTime: number;
  masterVolume: number;
  markers: Marker[];
  
  // Methods
  setIsPlaying: (value: boolean) => void;
  setBpm: (value: number) => void;
  setMasterVolume: (value: number) => void;
  initializeTone: () => Promise<void>;
  handlePlay: () => Promise<void>;
  handlePause: () => void;
  handleStop: () => void;
  handleBpmChange: (newBpm: number) => void;
  handleMIDINoteOn: (note: number, velocity: number) => void;
  handleMIDINoteOff: (note: number) => void;
  seekToPosition: (position: number) => void;
  addMarker: (name: string) => void;
  updateMarker: (marker: Marker) => void;
  deleteMarker: (markerId: string) => void;
  jumpToMarker: (markerId: string) => void;
}

// Export the context so it can be imported in other files
export const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
};

interface PlaybackProviderProps {
  children: ReactNode;
}

export const PlaybackProvider: React.FC<PlaybackProviderProps> = ({ children }) => {
  const { toast } = useToast();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [toneInitialized, setToneInitialized] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentTime, setCurrentTime] = useState(0);
  const [masterVolume, setMasterVolume] = useState(75);
  const [markers, setMarkers] = useState<Marker[]>([]);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const timerId = useRef<number | null>(null);
  const masterVolumeNode = useRef<Tone.Volume | null>(null);

  // Set up master volume
  useEffect(() => {
    if (toneInitialized && !masterVolumeNode.current) {
      masterVolumeNode.current = new Tone.Volume().toDestination();
      updateMasterVolume(masterVolume);
    }
    
    return () => {
      if (masterVolumeNode.current) {
        masterVolumeNode.current.dispose();
      }
    };
  }, [toneInitialized]);

  // Update master volume when changed
  const updateMasterVolume = (value: number) => {
    if (masterVolumeNode.current) {
      // Convert percentage to dB (roughly -60dB to 0dB)
      const dbValue = value <= 0 ? -Infinity : ((value / 100) * 60) - 60;
      masterVolumeNode.current.volume.value = dbValue;
    }
  };

  // Update current time display while playing
  useEffect(() => {
    if (isPlaying) {
      const updateTime = () => {
        setCurrentTime(Tone.Transport.seconds);
      };
      
      timerId.current = window.setInterval(updateTime, 100);
    } else if (timerId.current !== null) {
      window.clearInterval(timerId.current);
      timerId.current = null;
    }
    
    return () => {
      if (timerId.current !== null) {
        window.clearInterval(timerId.current);
      }
    };
  }, [isPlaying]);

  const initializeTone = async () => {
    if (!toneInitialized) {
      try {
        await Tone.start();
        setToneInitialized(true);
        console.log("Tone.js initialized");
        Tone.Transport.bpm.value = bpm;
        
        toast({
          title: "Audio initialized",
          description: "DAW is ready to play and record",
        });
        
        // Return void to match the Promise<void> return type
        return;
      } catch (error) {
        console.error("Failed to initialize Tone.js:", error);
        
        toast({
          title: "Audio initialization failed",
          description: "Please try again by clicking any play button",
          variant: "destructive"
        });
        
        // Return void to match the Promise<void> return type
        return;
      }
    }
    return;
  };
  
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
    setCurrentTime(0);
  };
  
  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    if (toneInitialized) {
      Tone.Transport.bpm.value = newBpm;
    }
  };
  
  const seekToPosition = (position: number) => {
    if (toneInitialized) {
      Tone.Transport.seconds = position;
      setCurrentTime(position);
    }
  };
  
  // ProTools-style markers
  const addMarker = (name: string = `Marker ${markers.length + 1}`) => {
    const newMarker: Marker = {
      id: `marker_${Date.now()}`,
      name,
      time: currentTime,
      color: '#8B5CF6'
    };
    
    setMarkers([...markers, newMarker]);
    
    toast({
      title: "Marker Added",
      description: `Added marker "${name}" at ${currentTime.toFixed(2)}s`,
    });
  };
  
  const updateMarker = (updatedMarker: Marker) => {
    setMarkers(markers.map(marker => 
      marker.id === updatedMarker.id ? updatedMarker : marker
    ));
  };
  
  const deleteMarker = (markerId: string) => {
    setMarkers(markers.filter(marker => marker.id !== markerId));
  };
  
  const jumpToMarker = (markerId: string) => {
    const marker = markers.find(m => m.id === markerId);
    if (marker) {
      seekToPosition(marker.time);
    }
  };
  
  const handleMIDINoteOn = (note: number, velocity: number = 100) => {
    console.log(`MIDI Note On: ${note}, velocity: ${velocity}`);
    // Removed synth.playNote handling - MIDI notes will be handled elsewhere
  };
  
  const handleMIDINoteOff = (note: number) => {
    console.log(`MIDI Note Off: ${note}`);
    // Removed synth.stopNote handling - MIDI notes will be handled elsewhere
  };

  const value: PlaybackContextType = {
    isPlaying,
    toneInitialized,
    bpm,
    timelineRef,
    currentTime,
    masterVolume,
    markers,
    
    setIsPlaying,
    setBpm,
    setMasterVolume: (value) => {
      setMasterVolume(value);
      updateMasterVolume(value);
    },
    initializeTone,
    handlePlay,
    handlePause,
    handleStop,
    handleBpmChange,
    handleMIDINoteOn,
    handleMIDINoteOff,
    seekToPosition,
    addMarker,
    updateMarker,
    deleteMarker,
    jumpToMarker
  };

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
};
