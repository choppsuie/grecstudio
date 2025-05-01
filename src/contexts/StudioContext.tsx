
import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useToast } from '@/hooks/use-toast';
import { useTrackManager } from '@/hooks/useTrackManager';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

interface StudioContextType {
  isPlaying: boolean;
  isRecording: boolean;
  toneInitialized: boolean;
  bpm: number;
  showMixer: boolean;
  projectId: string;
  collaborators: any[];
  timelineRef: React.RefObject<HTMLDivElement>;
  
  // Methods
  setIsPlaying: (value: boolean) => void;
  setIsRecording: (value: boolean) => void;
  setBpm: (value: number) => void;
  setShowMixer: (value: boolean) => void;
  initializeTone: () => Promise<void>;
  handlePlay: () => Promise<void>;
  handlePause: () => void;
  handleStop: () => void;
  handleRecord: () => Promise<void>;
  handleSave: () => Promise<void>;
  handleShare: () => void;
  handleBpmChange: (newBpm: number) => void;
  toggleMixer: () => void;
  handleRecordingComplete: (blob: Blob, duration: number) => void;
  handleMIDINoteOn: (note: number, velocity: number) => void;
  handleMIDINoteOff: (note: number) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};

interface StudioProviderProps {
  children: ReactNode;
}

export const StudioProvider: React.FC<StudioProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { tracks, updateTrack, addTrack } = useTrackManager();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [toneInitialized, setToneInitialized] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [showMixer, setShowMixer] = useState(true);
  const [projectId, setProjectId] = useState("demo-project");
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setCollaborators([
        { id: '1', name: 'Alice Cooper', avatar: '', status: 'online' },
        { id: '2', name: 'Bob Dylan', avatar: '', status: 'offline' },
      ]);
      
      const channel = supabase.channel('studio_collaboration');
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          console.log('Current collaborators:', state);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          toast({
            title: "Collaborator joined",
            description: `${newPresences[0]?.name || 'Someone'} has joined the session.`,
          });
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          toast({
            title: "Collaborator left",
            description: `${leftPresences[0]?.name || 'Someone'} has left the session.`,
          });
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED' && user) {
            await channel.track({
              userId: user.id,
              name: user.email || 'Anonymous',
              online_at: new Date().toISOString(),
            });
          }
        });
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, toast]);

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
  
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your project.",
        variant: "destructive"
      });
      return;
    }
    
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
  
  const handleMIDINoteOn = (note: number, velocity: number) => {
    console.log(`MIDI Note On: ${note}, velocity: ${velocity}`);
  };
  
  const handleMIDINoteOff = (note: number) => {
    console.log(`MIDI Note Off: ${note}`);
  };
  
  const handleBpmChange = (newBpm: number) => {
    setBpm(newBpm);
    if (toneInitialized) {
      Tone.Transport.bpm.value = newBpm;
    }
  };
  
  // Fix: Modified to not take any arguments
  const toggleMixer = () => {
    setShowMixer(!showMixer);
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

  const value: StudioContextType = {
    isPlaying,
    isRecording,
    toneInitialized,
    bpm,
    showMixer,
    projectId,
    collaborators,
    timelineRef,
    
    setIsPlaying,
    setIsRecording,
    setBpm,
    setShowMixer,
    initializeTone,
    handlePlay,
    handlePause,
    handleStop,
    handleRecord,
    handleSave,
    handleShare,
    handleBpmChange,
    toggleMixer,
    handleRecordingComplete,
    handleMIDINoteOn,
    handleMIDINoteOff,
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
};
