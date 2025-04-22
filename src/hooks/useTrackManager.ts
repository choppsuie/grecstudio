
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Track {
  id: string;
  name: string;
  type: "audio" | "midi" | "vocal";
  volume: number;
  muted: boolean;
  soloed: boolean;
  color: string;
}

export const useTrackManager = (initialTracks?: Track[]) => {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>(initialTracks || [
    {
      id: "1",
      name: "Drums",
      type: "audio",
      volume: 75,
      muted: false,
      soloed: false,
      color: "#8B5CF6"
    },
    {
      id: "2",
      name: "Bass",
      type: "audio",
      volume: 80,
      muted: false,
      soloed: false,
      color: "#1EAEDB"
    },
    {
      id: "3",
      name: "Synth Lead",
      type: "midi",
      volume: 65,
      muted: false,
      soloed: false,
      color: "#33C3F0"
    },
    {
      id: "4",
      name: "Vocals",
      type: "vocal",
      volume: 90,
      muted: false,
      soloed: false,
      color: "#D6BCFA"
    }
  ]);

  const updateTrack = (updatedTrack: Track) => {
    setTracks(tracks.map(track => 
      track.id === updatedTrack.id ? updatedTrack : track
    ));
  };

  const addTrack = () => {
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      name: `Track ${tracks.length + 1}`,
      type: "audio",
      volume: 75,
      muted: false,
      soloed: false,
      color: "#ED213A"
    };
    
    setTracks([...tracks, newTrack]);
    toast({
      title: "Track added",
      description: `Added new track: ${newTrack.name}`,
    });
  };

  return {
    tracks,
    updateTrack,
    addTrack
  };
};
