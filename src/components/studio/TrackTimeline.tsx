
import { Track } from "@/hooks/useTrackManager";
import AudioVisualizer from "@/components/AudioVisualizer";

interface TrackTimelineProps {
  tracks: Track[];
  isPlaying: boolean;
}

const TrackTimeline = ({ tracks, isPlaying }: TrackTimelineProps) => {
  return (
    <div className="flex-1">
      {tracks.map((track) => (
        <div key={track.id} className="h-24 mb-2 border border-cyber-purple/10 rounded-md overflow-hidden">
          <div className="h-full w-full">
            <AudioVisualizer isPlaying={isPlaying} color={track.color} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackTimeline;
