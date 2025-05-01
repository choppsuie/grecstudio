
import React from 'react';
import { useStudio } from '@/contexts/StudioHooks'; // Updated import path
import TrackList from '@/components/TrackList';
import { useTrackManager } from '@/hooks/useTrackManager';
import StudioSidebar from './StudioSidebar';

const StudioContent = () => {
  const { showMixer } = useStudio();
  const { tracks, updateTrack } = useTrackManager();
  
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="p-2">
          <TrackList 
            tracks={tracks} 
            onTrackUpdate={updateTrack}
          />
        </div>
      </div>
      
      <StudioSidebar />
    </div>
  );
};

export default StudioContent;
