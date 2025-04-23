
import React from 'react';

const TimelineRuler = () => {
  // Generate tick marks for 2 bars with 4 beats each (total 8 beats)
  const generateTicks = () => {
    const ticks = [];
    const numMeasures = 16; // Show 16 measures in the ruler
    const beatsPerMeasure = 4; // 4/4 time signature
    
    for (let measure = 1; measure <= numMeasures; measure++) {
      const measureNumber = measure;
      
      // Add major tick for measure start
      ticks.push(
        <div key={`measure-${measure}`} className="ruler-tick-major flex flex-col items-center">
          <span className="text-xs text-white/60">{measureNumber}</span>
          <div className="h-3 w-px bg-cyber-purple/40"></div>
        </div>
      );
      
      // Add minor ticks for beats within the measure
      for (let beat = 1; beat < beatsPerMeasure; beat++) {
        ticks.push(
          <div key={`measure-${measure}-beat-${beat}`} className="ruler-tick-minor flex flex-col items-center">
            <div className="h-2 w-px bg-cyber-purple/20"></div>
          </div>
        );
      }
    }
    
    return ticks;
  };
  
  return (
    <div className="relative h-8 border-b border-cyber-purple/30 bg-cyber-dark flex items-end overflow-hidden">
      <div className="absolute inset-0 flex items-end px-1">
        {/* Transport position indicator (playhead) */}
        <div className="absolute top-0 bottom-0 left-0 w-px bg-cyber-red z-10">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyber-red"></div>
        </div>
        
        {/* Ruler ticks */}
        <div className="flex-1 flex justify-between items-end pb-1">
          {generateTicks()}
        </div>
      </div>
    </div>
  );
};

export default TimelineRuler;
