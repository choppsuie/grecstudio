
import React from "react";
import { StudioProvider } from "@/contexts/StudioContext";
import { useStudio } from "@/contexts/StudioHooks"; // Updated import path
import StudioToolbar from "@/components/studio/StudioToolbar";
import StudioContent from "@/components/studio/StudioContent";
import StudioStatusBar from "@/components/studio/StudioStatusBar";
import StudioRecorder from "@/components/studio/StudioRecorder";
import StudioHeader from "@/components/studio/StudioHeader";
import AudioEngine from "@/components/AudioEngine";
import StudioMenubar from "@/components/studio/StudioMenubar";
import { useTrackManager } from '@/hooks/useTrackManager';

const Studio = () => {
  const { tracks } = useTrackManager();

  return (
    <StudioProvider>
      <StudioWrapper tracks={tracks} />
    </StudioProvider>
  );
};

const StudioWrapper: React.FC<{ tracks: any[] }> = ({ tracks }) => {
  const { isPlaying } = useStudio();

  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col">
      <StudioHeader />
      
      {/* Top Navigation */}
      <div className="border-b border-cyber-purple/20 bg-cyber-darker">
        <StudioMenubar />
        <StudioToolbar />
      </div>
      
      <AudioEngine isPlaying={isPlaying} tracks={tracks} />
      
      <StudioContent />
      <StudioRecorder />
      <StudioStatusBar />
    </div>
  );
};

export default Studio;
