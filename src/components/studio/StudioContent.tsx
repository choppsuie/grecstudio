
import React, { useState } from 'react';
import { useStudio } from '@/contexts/StudioHooks';
import TrackList from '@/components/TrackList';
import { useTrackManager } from '@/hooks/useTrackManager';
import StudioSidebar from './StudioSidebar';
import TrackTimeline from './TrackTimeline';
import { Button } from '@/components/ui/button';
import { Plus, Maximize, Minimize, AudioWaveform, Wand2 } from 'lucide-react';
import DAWCanvas from './DAWCanvas';
import MixerEffectsRack from './MixerEffectsRack';
import PatternGenerator from './PatternGenerator';

const StudioContent = () => {
  const { showMixer, isPlaying } = useStudio();
  const { tracks, updateTrack, addTrack } = useTrackManager();
  const [timelineZoom, setTimelineZoom] = useState(100);
  const [showDAWCanvas, setShowDAWCanvas] = useState(true);
  const [showMixerEffects, setShowMixerEffects] = useState(false);
  const [showPatternGenerator, setShowPatternGenerator] = useState(false);
  
  const handleZoomChange = (newZoom: number) => {
    setTimelineZoom(Math.max(50, Math.min(200, newZoom)));
  };
  
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="p-2 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium text-cyber-purple neon-text">Timeline</h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="h-7 py-0 px-3 text-xs flex items-center gap-1 cyber-button"
                onClick={() => setShowDAWCanvas(!showDAWCanvas)}
              >
                {showDAWCanvas ? (
                  <>
                    <Minimize className="h-3.5 w-3.5 mr-1" />
                    Hide Instruments
                  </>
                ) : (
                  <>
                    <Maximize className="h-3.5 w-3.5 mr-1" />
                    Show Instruments
                  </>
                )}
              </Button>
              
              <Button 
                variant={showMixerEffects ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-7 py-0 px-3 text-xs flex items-center gap-1",
                  showMixerEffects 
                    ? "bg-cyber-purple hover:bg-cyber-purple/80" 
                    : "cyber-button"
                )}
                onClick={() => setShowMixerEffects(!showMixerEffects)}
              >
                <AudioWaveform className="h-3.5 w-3.5 mr-1" />
                Mixer Effects
              </Button>
              
              <Button 
                variant={showPatternGenerator ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-7 py-0 px-3 text-xs flex items-center gap-1",
                  showPatternGenerator 
                    ? "bg-cyber-purple hover:bg-cyber-purple/80" 
                    : "cyber-button"
                )}
                onClick={() => setShowPatternGenerator(!showPatternGenerator)}
              >
                <Wand2 className="h-3.5 w-3.5 mr-1" />
                Pattern Generator
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 py-0 px-2 text-xs cyber-button"
                onClick={() => handleZoomChange(timelineZoom - 10)}
              >
                -
              </Button>
              <div className="text-xs w-10 text-center bg-cyber-dark/50 rounded px-1 py-0.5 border border-cyber-purple/20">
                {timelineZoom}%
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 py-0 px-2 text-xs cyber-button"
                onClick={() => handleZoomChange(timelineZoom + 10)}
              >
                +
              </Button>
            </div>
          </div>
          
          {showDAWCanvas && <DAWCanvas />}
          
          {showMixerEffects && (
            <div className="mb-4">
              <MixerEffectsRack className="mt-2" />
            </div>
          )}
          
          {showPatternGenerator && (
            <div className="mb-4">
              <PatternGenerator className="mt-2" />
            </div>
          )}
          
          <div className="flex flex-row">
            <div className="w-64 min-w-64 pr-2 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-medium text-cyber-purple neon-text">Tracks</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 flex items-center gap-1 cyber-button flashing-box"
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
