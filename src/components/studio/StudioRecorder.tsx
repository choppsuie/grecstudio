
import React from 'react';
import AudioRecorder from '@/components/audio/AudioRecorder';
import { useStudio } from '@/contexts/StudioHooks';

const StudioRecorder = () => {
  const { isRecording, projectId, handleRecordingComplete } = useStudio();

  // Create a wrapper function to handle the different parameter types
  const onRecordingComplete = (blob: Blob, duration: number) => {
    handleRecordingComplete(blob, duration);
  };

  if (!isRecording) return null;

  return (
    <div className="fixed bottom-16 right-6 bg-cyber-darker/95 border border-cyber-red/50 p-3 rounded-lg shadow-lg backdrop-blur-sm">
      <AudioRecorder 
        projectId={projectId}
        onRecordingComplete={onRecordingComplete} 
      />
    </div>
  );
};

export default StudioRecorder;
