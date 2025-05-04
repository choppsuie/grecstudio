
import React, { useState, useRef, useEffect } from 'react';
import AudioVisualizer from "@/components/AudioVisualizer";
import TimelineRuler from './TimelineRuler';
import AudioClip, { AudioClipProps } from './AudioClip';
import TimelinePlayhead from './TimelinePlayhead';
import { usePlayback } from '@/contexts/PlaybackContext';
import * as Tone from 'tone';

interface Track {
  id: string;
  color: string;
  type: string;
  name: string;
}

interface TrackTimelineProps {
  tracks: Track[];
  isPlaying: boolean;
}

// Sample audio clips data (in a real app this would come from a state/context)
const initialClips: Record<string, AudioClipProps[]> = {
  '1': [
    { id: 'clip1', name: 'Drum Loop', start: 0, duration: 2, color: '#9b87f5' },
    { id: 'clip2', name: 'Fill', start: 8, duration: 1, color: '#9b87f5' }
  ],
  '2': [
    { id: 'clip3', name: 'Bass Line', start: 0, duration: 4, color: '#0EA5E9' }
  ],
  '3': [
    { id: 'clip4', name: 'Synth Lead', start: 4, duration: 4, color: '#D946EF' }
  ]
};

const TrackTimeline = ({ tracks, isPlaying }: TrackTimelineProps) => {
  const { timelineRef, seekToPosition } = usePlayback();
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [clipsState, setClipsState] = useState<Record<string, AudioClipProps[]>>(initialClips);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rulerWidth, setRulerWidth] = useState(0);
  
  // Update ruler width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setRulerWidth(containerRef.current.clientWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  const handleClipSelect = (clipId: string) => {
    setSelectedClip(clipId === selectedClip ? null : clipId);
  };
  
  const handleClipResize = (clipId: string, newStart: number, newDuration: number) => {
    // Update clip dimensions
    setClipsState(prevState => {
      const newState = { ...prevState };
      
      // Find the clip in all tracks
      for (const trackId in newState) {
        const trackIndex = newState[trackId].findIndex(clip => clip.id === clipId);
        if (trackIndex !== -1) {
          newState[trackId] = [...newState[trackId]];
          newState[trackId][trackIndex] = {
            ...newState[trackId][trackIndex],
            start: newStart,
            duration: newDuration
          };
          break;
        }
      }
      
      return newState;
    });
  };
  
  const handleClipMove = (clipId: string, newStart: number) => {
    // Update clip position
    setClipsState(prevState => {
      const newState = { ...prevState };
      
      // Find the clip in all tracks
      for (const trackId in newState) {
        const trackIndex = newState[trackId].findIndex(clip => clip.id === clipId);
        if (trackIndex !== -1) {
          newState[trackId] = [...newState[trackId]];
          newState[trackId][trackIndex] = {
            ...newState[trackId][trackIndex],
            start: newStart
          };
          break;
        }
      }
      
      return newState;
    });
  };
  
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    // Calculate position as fraction of timeline width
    const rect = containerRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    
    // Convert to time in seconds (assuming 16 beats at current BPM)
    const totalDuration = 16 * 4 * 60 / Tone.Transport.bpm.value; // 16 bars in seconds
    const timePosition = clickPosition * totalDuration;
    
    // Seek to that position
    seekToPosition(timePosition);
  };
  
  return (
    <div ref={containerRef} className="flex-1 flex flex-col overflow-hidden">
      <div className="relative">
        <TimelineRuler width={rulerWidth} />
        <TimelinePlayhead rulerWidth={rulerWidth} />
      </div>
      
      <div 
        className="flex-1 overflow-y-auto relative"
        onClick={handleTimelineClick}
        ref={timelineRef}
      >
        {tracks.map((track) => (
          <div 
            key={track.id} 
            className="track-timeline h-24 mb-2 border border-cyber-purple/10 rounded-md overflow-hidden relative"
          >
            {/* Track background visualization */}
            <div className="absolute inset-0 opacity-30">
              <AudioVisualizer isPlaying={isPlaying} color={track.color} />
            </div>
            
            {/* Audio clips */}
            <div className="absolute inset-0 p-0">
              {clipsState[track.id]?.map(clip => (
                <AudioClip
                  key={clip.id}
                  {...clip}
                  selected={clip.id === selectedClip}
                  onSelect={handleClipSelect}
                  onResize={handleClipResize}
                  onMove={handleClipMove}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackTimeline;
