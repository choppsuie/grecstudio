
import { useState, useEffect } from "react";
import { AudioClipProps } from "@/components/studio/AudioClip";
import * as Tone from 'tone';

export interface AudioClipWithTrack extends AudioClipProps {
  trackId: string;
  audioBuffer?: AudioBuffer; // Optional audio buffer if loaded
  player?: Tone.Player; // Reference to Tone.js player for this clip
}

export const useAudioClipManager = () => {
  const [clips, setClips] = useState<AudioClipWithTrack[]>([]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  
  // Load initial demo clips
  useEffect(() => {
    // Sample clips
    const initialClips: AudioClipWithTrack[] = [
      { 
        id: 'clip1', 
        name: 'Drum Loop', 
        start: 0, 
        duration: 2, 
        color: '#9b87f5',
        trackId: '1'
      },
      { 
        id: 'clip2', 
        name: 'Fill', 
        start: 8, 
        duration: 1, 
        color: '#9b87f5',
        trackId: '1'
      },
      { 
        id: 'clip3', 
        name: 'Bass Line', 
        start: 0, 
        duration: 4, 
        color: '#0EA5E9',
        trackId: '2'
      },
      { 
        id: 'clip4', 
        name: 'Synth Lead', 
        start: 4, 
        duration: 4, 
        color: '#D946EF',
        trackId: '3'
      }
    ];
    
    setClips(initialClips);
  }, []);
  
  // Add a new clip
  const addClip = (clip: Omit<AudioClipWithTrack, 'id'>) => {
    const newClip: AudioClipWithTrack = {
      ...clip,
      id: `clip-${Date.now()}`
    };
    
    setClips([...clips, newClip]);
    return newClip.id;
  };
  
  // Update clip position or duration
  const updateClip = (
    clipId: string, 
    updates: Partial<Omit<AudioClipWithTrack, 'id'>>
  ) => {
    setClips(prevClips => 
      prevClips.map(clip => 
        clip.id === clipId ? { ...clip, ...updates } : clip  
      )
    );
  };
  
  // Move a clip to a new position
  const moveClip = (clipId: string, newStart: number) => {
    updateClip(clipId, { start: newStart });
  };
  
  // Resize a clip
  const resizeClip = (clipId: string, newStart: number, newDuration: number) => {
    updateClip(clipId, { start: newStart, duration: newDuration });
  };
  
  // Delete a clip
  const deleteClip = (clipId: string) => {
    setClips(prevClips => prevClips.filter(clip => clip.id !== clipId));
    
    if (selectedClipId === clipId) {
      setSelectedClipId(null);
    }
  };
  
  // Select a clip
  const selectClip = (clipId: string) => {
    setSelectedClipId(previousId => previousId === clipId ? null : clipId);
  };
  
  // Get clips for a specific track
  const getTrackClips = (trackId: string) => {
    return clips.filter(clip => clip.trackId === trackId);
  };
  
  // Load audio for a clip
  const loadClipAudio = async (clipId: string, audioFile: Blob) => {
    try {
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await Tone.getContext().decodeAudioData(arrayBuffer);
      
      updateClip(clipId, { 
        audioBuffer,
        // Update duration based on actual audio length
        duration: audioBuffer.duration
      });
      
      return true;
    } catch (error) {
      console.error("Failed to load audio for clip:", error);
      return false;
    }
  };
  
  return {
    clips,
    selectedClipId,
    addClip,
    updateClip,
    moveClip,
    resizeClip,
    deleteClip,
    selectClip,
    getTrackClips,
    loadClipAudio
  };
};

export default useAudioClipManager;
