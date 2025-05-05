
import React from 'react';
import { WaveformVisualizationProps } from './types/clipTypes';

const WaveformVisualization: React.FC<WaveformVisualizationProps> = ({ color = '#8B5CF6' }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="w-[2px] mx-[1px]"
          style={{
            height: `${20 + Math.sin(i / 2) * 20}%`,
            backgroundColor: color || 'rgba(139, 92, 246, 0.6)'
          }}
        />
      ))}
    </div>
  );
};

export default WaveformVisualization;
