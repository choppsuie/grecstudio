
import React, { useState } from 'react';
import AudioVisualizer from "@/components/AudioVisualizer";
import TimelineRuler from './TimelineRuler';
import AudioClip, { AudioClipProps } from './AudioClip';

interface Track {
  id: string;
  color: string;
  type: string;
  name: string;
}

interface TrackTimelineProps {
  tracks: Track[];
  isPlaying: boolean;
}

// Sample audio clips data (in a real app this would come from a state/context)
const sampleClips: Record<string, AudioClipProps[]> = {
  '1': [
    { id: 'clip1', name: 'Drum Loop', start: 0, duration: 2, color: '#9b87f5' },
    { id: 'clip2', name: 'Fill', start: 8, duration: 1, color: '#9b87f5' }
  ],
  '2': [
    { id: 'clip3', name: 'Bass Line', start: 0, duration: 4, color: '#0EA5E9' }
  ],
  '3': [
    { id: 'clip4', name: 'Synth Lead', start: 4, duration: 4, color: '#D946EF' }
  ]
};

const TrackTimeline = ({ tracks, isPlaying }: TrackTimelineProps) => {
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  
  const handleClipSelect = (clipId: string) => {
    setSelectedClip(clipId === selectedClip ? null : clipId);
  };
  
  return (
    <div className="flex-1 flex flex-col">
      <TimelineRuler />
      
      <div className="flex-1 overflow-y-auto">
        {tracks.map((track) => (
          <div key={track.id} className="h-24 mb-2 border border-cyber-purple/10 rounded-md overflow-hidden relative">
            {/* Track background visualization */}
            <div className="absolute inset-0 opacity-30">
              <AudioVisualizer isPlaying={isPlaying} color={track.color} />
            </div>
            
            {/* Audio clips */}
            <div className="absolute inset-0 p-0">
              {sampleClips[track.id]?.map(clip => (
                <AudioClip
                  key={clip.id}
                  {...clip}
                  selected={clip.id === selectedClip}
                  onSelect={handleClipSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackTimeline;
