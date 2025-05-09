
import React from 'react';
import { useStudio } from '@/contexts/StudioHooks';

const StudioStatusBar = () => {
  const { isRecording, bpm } = useStudio();

  return (
    <div className="h-6 bg-gradient-to-r from-cyber-red to-cyber-purple px-3 flex items-center text-xs">
      <div className="flex-1">
        {isRecording ? (
          <span className="text-white font-medium">● Recording...</span>
        ) : (
          <span className="text-white">Ready</span>
        )}
      </div>
      <div className="flex space-x-4 text-white">
        <span>48000 Hz, Stereo</span>
        <span>{bpm} BPM</span>
        <span>4/4</span>
        <span>CPU: 10%</span>
      </div>
    </div>
  );
};

export default StudioStatusBar;
