
import React, { useEffect, useRef } from 'react';
import { usePlayback } from '@/contexts/PlaybackContext';
import * as Tone from 'tone';

interface TimelinePlayheadProps {
  rulerWidth: number;
}

const TimelinePlayhead = ({ rulerWidth }: TimelinePlayheadProps) => {
  const { isPlaying, currentTime } = usePlayback();
  const playheadRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Calculate playhead position based on current time
  const updatePlayheadPosition = () => {
    if (!playheadRef.current) return;
    
    const totalDuration = 16 * 4 * 60 / Tone.Transport.bpm.value; // 16 bars in seconds
    const completion = Tone.Transport.seconds / totalDuration;
    
    // Ensure position stays within bounds
    const position = Math.min(Math.max(0, completion * rulerWidth), rulerWidth);
    playheadRef.current.style.transform = `translateX(${position}px)`;
    
    // Continue animation if still playing
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updatePlayheadPosition);
    }
  };
  
  // Start or stop playhead animation based on playing state
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updatePlayheadPosition);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, rulerWidth]);
  
  // Update position when currentTime changes (for seeking)
  useEffect(() => {
    if (!isPlaying && playheadRef.current) {
      const totalDuration = 16 * 4 * 60 / Tone.Transport.bpm.value;
      const completion = currentTime / totalDuration;
      const position = Math.min(Math.max(0, completion * rulerWidth), rulerWidth);
      playheadRef.current.style.transform = `translateX(${position}px)`;
    }
  }, [currentTime, isPlaying, rulerWidth]);
  
  return (
    <div 
      ref={playheadRef}
      className="absolute top-0 bottom-0 left-0 w-0.5 bg-cyber-red z-20 pointer-events-none"
      style={{ 
        height: '100%',
        transform: 'translateX(0px)',
      }}
    >
      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyber-red"></div>
    </div>
  );
};

export default TimelinePlayhead;
