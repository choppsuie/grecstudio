
import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useToast } from '@/hooks/use-toast';

interface PlaybackContextType {
  isPlaying: boolean;
  toneInitialized: boolean;
  bpm: number;
  timelineRef: React.RefObject<HTMLDivElement>;
  currentTime: number;
  
  // Methods
  setIsPlaying: (value: boolean) => void;
  setBpm: (value: number) => void;
  initializeTone: () => Promise<void>;
  handlePlay: () => Promise<void>;
  handlePause: () => void;
  handleStop: () => void;
  handleBpmChange: (newBpm: number) => void;
  handleMIDINoteOn: (note: number, velocity: number) => void;
  handleMIDINoteOff: (note: number) => void;
  seekToPosition: (position: number) => void;
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
  const timelineRef = useRef<HTMLDivElement>(null);
  const timerId = useRef<number | null>(null);

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
      await Tone.start();
      setToneInitialized(true);
      console.log("Tone.js initialized");
      Tone.Transport.bpm.value = bpm;
    }
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
  
  const handleMIDINoteOn = (note: number, velocity: number) => {
    console.log(`MIDI Note On: ${note}, velocity: ${velocity}`);
  };
  
  const handleMIDINoteOff = (note: number) => {
    console.log(`MIDI Note Off: ${note}`);
  };

  const value: PlaybackContextType = {
    isPlaying,
    toneInitialized,
    bpm,
    timelineRef,
    currentTime,
    
    setIsPlaying,
    setBpm,
    initializeTone,
    handlePlay,
    handlePause,
    handleStop,
    handleBpmChange,
    handleMIDINoteOn,
    handleMIDINoteOff,
    seekToPosition,
  };

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
};
