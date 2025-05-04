
import React, { useState } from 'react';
import { useStudio } from '@/contexts/StudioHooks';
import TrackList from '@/components/TrackList';
import { useTrackManager } from '@/hooks/useTrackManager';
import StudioSidebar from './StudioSidebar';
import TrackTimeline from './TrackTimeline';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const StudioContent = () => {
  const { showMixer, isPlaying } = useStudio();
  const { tracks, updateTrack, addTrack } = useTrackManager();
  const [timelineZoom, setTimelineZoom] = useState(100);
  
  const handleZoomChange = (newZoom: number) => {
    setTimelineZoom(Math.max(50, Math.min(200, newZoom)));
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="p-2 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium text-cyber-purple">Timeline</h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 py-0 px-2 text-xs"
                onClick={() => handleZoomChange(timelineZoom - 10)}
              >
                -
              </Button>
              <div className="text-xs w-10 text-center">{timelineZoom}%</div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 py-0 px-2 text-xs"
                onClick={() => handleZoomChange(timelineZoom + 10)}
              >
                +
              </Button>
            </div>
          </div>
          
          <div className="flex flex-row">
            <div className="w-64 min-w-64 pr-2 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-medium text-cyber-purple">Tracks</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 flex items-center gap-1"
                  onClick={addTrack}
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span className="text-xs">Add Track</span>
                </Button>
              </div>
              
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
      </div>
      
      <StudioSidebar />
    </div>
  );
};

export default StudioContent;
