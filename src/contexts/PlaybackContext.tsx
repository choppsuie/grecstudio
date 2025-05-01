
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as Tone from 'tone';
import { useToast } from '@/hooks/use-toast';

interface PlaybackContextType {
  isPlaying: boolean;
  toneInitialized: boolean;
  bpm: number;
  timelineRef: React.RefObject<HTMLDivElement>;
  
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
}

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

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
  const timelineRef = React.useRef<HTMLDivElement>(null);

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
  };
  
  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    if (toneInitialized) {
      Tone.Transport.bpm.value = newBpm;
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
    
    setIsPlaying,
    setBpm,
    initializeTone,
    handlePlay,
    handlePause,
    handleStop,
    handleBpmChange,
    handleMIDINoteOn,
    handleMIDINoteOff,
  };

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>;
};
