
import React from "react";
import { StudioProvider } from "@/contexts/StudioContext";
import { useStudio } from "@/contexts/StudioHooks";
import StudioToolbar from "@/components/studio/StudioToolbar";
import StudioContent from "@/components/studio/StudioContent";
import StudioStatusBar from "@/components/studio/StudioStatusBar";
import StudioRecorder from "@/components/studio/StudioRecorder";
import StudioHeader from "@/components/studio/StudioHeader";
import AudioEngine from "@/components/AudioEngine";
import StudioMenubar from "@/components/studio/StudioMenubar";
import { useTrackManager } from '@/hooks/useTrackManager';
import GLSLBackground from "@/components/studio/GLSLBackground";

const Studio = () => {
  const { tracks } = useTrackManager();

  return (
    <StudioProvider>
      <GLSLBackground />
      <StudioWrapper tracks={tracks} />
    </StudioProvider>
  );
};

const StudioWrapper: React.FC<{ tracks: any[] }> = ({ tracks }) => {
  const { isPlaying } = useStudio();

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden backdrop-blur-sm bg-cyber-dark/70">
      <StudioHeader />
      
      {/* Top Navigation */}
      <div className="border-b border-cyber-purple/20 bg-cyber-darker/90 shadow-lg">
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
