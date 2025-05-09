
import React from 'react';
import { useStudio } from '@/contexts/StudioHooks';

const StudioStatusBar = () => {
  const { isRecording, bpm } = useStudio();

  return (
    <div className="h-6 bg-cyber-darker border-t border-cyber-purple/20 px-3 flex items-center text-xs text-cyber-text">
      <div className="flex-1">
        {isRecording ? (
          <span className="text-cyber-red font-medium">● Recording...</span>
        ) : (
          <span className="text-cyber-text-muted">Ready</span>
        )}
      </div>
      <div className="flex space-x-4 text-cyber-text-muted">
        <span>48000 Hz, Stereo</span>
        <span>{bpm} BPM</span>
        <span>4/4</span>
        <span>CPU: 10%</span>
      </div>
    </div>
  );
};

export default StudioStatusBar;
