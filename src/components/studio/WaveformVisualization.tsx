
import React from 'react';
import { WaveformVisualizationProps } from './types/clipTypes';

const WaveformVisualization: React.FC<WaveformVisualizationProps> = ({ color }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="w-[2px] mx-[1px] bg-white/40"
          style={{
            height: `${20 + Math.sin(i / 2) * 20}%`
          }}
        />
      ))}
    </div>
  );
};

export default WaveformVisualization;
