
import React from 'react';
import { useStudio } from '@/contexts/StudioHooks';
import TrackList from '@/components/TrackList';
import { useTrackManager } from '@/hooks/useTrackManager';
import StudioSidebar from './StudioSidebar';
import TrackTimeline from './TrackTimeline';

const StudioContent = () => {
  const { showMixer, isPlaying } = useStudio();
  const { tracks, updateTrack } = useTrackManager();
  
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="p-2 flex flex-row">
          <div className="w-64 min-w-64 pr-2">
            <TrackList 
              tracks={tracks} 
              onTrackUpdate={updateTrack}
            />
          </div>
          
          <TrackTimeline 
            tracks={tracks} 
            isPlaying={isPlaying} 
          />
        </div>
      </div>
      
      <StudioSidebar />
    </div>
  );
};

export default StudioContent;
