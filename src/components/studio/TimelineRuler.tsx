
import React, { useRef, useState, useEffect } from 'react';
import { usePlayback } from '@/contexts/PlaybackContext';
import * as Tone from 'tone';
import { cn } from '@/lib/utils';

const TimelineRuler = () => {
  const { timelineRef, seekToPosition } = usePlayback();
  const [rulerWidth, setRulerWidth] = useState(0);
  const rulerRef = useRef<HTMLDivElement>(null);
  
  // Measure ruler width for playhead positioning
  useEffect(() => {
    if (rulerRef.current) {
      const updateWidth = () => {
        if (rulerRef.current) {
          setRulerWidth(rulerRef.current.clientWidth);
        }
      };
      
      // Initial measurement
      updateWidth();
      
      // Update on window resize
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, []);

  // Handle ruler click to seek
  const handleRulerClick = (e: React.MouseEvent) => {
    if (!rulerRef.current) return;
    
    // Calculate position as fraction of timeline width
    const rect = rulerRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    
    // Convert to time in seconds (assuming 16 beats at current BPM)
    const totalDuration = 16 * 4 * 60 / Tone.Transport.bpm.value; // 16 bars in seconds
    const timePosition = clickPosition * totalDuration;
    
    // Seek to that position
    seekToPosition(timePosition);
  };
  
  // Generate tick marks for 16 bars with 4 beats each
  const generateTicks = () => {
    const ticks = [];
    const numMeasures = 16; // Show 16 measures in the ruler
    const beatsPerMeasure = 4; // 4/4 time signature
    
    for (let measure = 0; measure < numMeasures; measure++) {
      const measureNumber = measure + 1;
      
      // Add major tick for measure start
      ticks.push(
        <div 
          key={`measure-${measure}`} 
          className="ruler-tick-major flex flex-col items-center"
          style={{ cursor: 'pointer' }}
        >
          <span className="text-xs text-white/60">{measureNumber}</span>
          <div className="h-3 w-px bg-cyber-purple/40"></div>
        </div>
      );
      
      // Add minor ticks for beats within the measure
      for (let beat = 1; beat < beatsPerMeasure; beat++) {
        ticks.push(
          <div 
            key={`measure-${measure}-beat-${beat}`} 
            className="ruler-tick-minor flex flex-col items-center"
            style={{ cursor: 'pointer' }}
          >
            <div className="h-2 w-px bg-cyber-purple/20"></div>
          </div>
        );
      }
    }
    
    return ticks;
  };
  
  return (
    <div 
      className={cn(
        "relative h-8 border-b border-cyber-purple/30 bg-cyber-dark",
        "flex items-end overflow-hidden cursor-pointer"
      )}
      onClick={handleRulerClick}
      ref={rulerRef}
    >
      <div className="absolute inset-0 flex items-end px-1">
        <div className="flex-1 flex justify-between items-end pb-1">
          {generateTicks()}
        </div>
      </div>
    </div>
  );
};

export default TimelineRuler;
