
import React from 'react';
import { useStudio } from '@/contexts/StudioHooks';

const StudioStatusBar = () => {
  const { isRecording, bpm } = useStudio();

  return (
    <div className="h-6 bg-cyber-darker border-t border-cyber-purple/20 px-3 flex items-center text-xs text-cyber-purple/70">
      <div className="flex-1">
        {isRecording ? (
          <span className="text-cyber-red font-medium">● Recording...</span>
        ) : (
          "Ready"
        )}
      </div>
      <div className="flex space-x-4">
        <span>48000 Hz, Stereo</span>
        <span>{bpm} BPM</span>
        <span>4/4</span>
        <span>CPU: 10%</span>
      </div>
    </div>
  );
};

export default StudioStatusBar;
