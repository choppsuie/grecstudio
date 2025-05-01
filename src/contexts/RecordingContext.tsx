
import React, { createContext, useState, useContext, ReactNode } from 'react';
import * as Tone from 'tone';
import { useToast } from '@/hooks/use-toast';
import { usePlayback } from './PlaybackContext';
import { useTrackManager } from '@/hooks/useTrackManager';

interface RecordingContextType {
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
  handleRecord: () => Promise<void>;
  handleRecordingComplete: (blob: Blob, duration: number) => void;
}

const RecordingContext = createContext<RecordingContextType | undefined>(undefined);

export const useRecording = () => {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error('useRecording must be used within a RecordingProvider');
  }
  return context;
};

interface RecordingProviderProps {
  children: ReactNode;
}

export const RecordingProvider: React.FC<RecordingProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const { initializeTone, isPlaying, handlePlay, handlePause } = usePlayback();
  const { addTrack } = useTrackManager();
  
  const [isRecording, setIsRecording] = useState(false);
  
  const handleRecord = async () => {
    await initializeTone();
    
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (isPlaying) {
        handlePause();
      }
      toast({
        title: "Recording stopped",
        description: "Your recording has been saved.",
      });
    } else {
      // Start recording
      setIsRecording(true);
      if (!isPlaying) {
        handlePlay();
      }
      toast({
        title: "Recording started",
        description: "Recording in progress...",
        variant: "destructive"
      });
    }
  };
  
  const handleRecordingComplete = (blob: Blob, duration: number) => {
    console.log(`Recording complete: ${duration.toFixed(1)}s`);
    setIsRecording(false);
    
    // Add a new track with the recording
    addTrack({
      name: `Recording ${new Date().toLocaleTimeString()}`,
      type: 'audio',
      color: '#F9636F',
    });
    
    toast({
      title: "Recording complete",
      description: `${duration.toFixed(1)}s audio saved to new track.`,
    });
  };

  const value: RecordingContextType = {
    isRecording,
    setIsRecording,
    handleRecord,
    handleRecordingComplete,
  };

  return <RecordingContext.Provider value={value}>{children}</RecordingContext.Provider>;
};
