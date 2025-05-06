
import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { usePlayback } from "@/contexts/PlaybackContext";

const Metronome = () => {
  const { isPlaying, toneInitialized, bpm } = usePlayback();
  const [active, setActive] = useState(false);
  const [clickScheduleId, setClickScheduleId] = useState<number | null>(null);

  // Set up click sounds
  useEffect(() => {
    if (!toneInitialized || !active) return;

    // Clean up previous click if any
    if (clickScheduleId !== null) {
      Tone.Transport.clear(clickScheduleId);
    }

    // Create click sounds
    const highClick = new Tone.Player({
      url: "https://tonejs.github.io/audio/drum-samples/hi-hats/hihat_01.mp3",
      volume: -10
    }).toDestination();

    const lowClick = new Tone.Player({
      url: "https://tonejs.github.io/audio/drum-samples/hi-hats/hihat_04.mp3",
      volume: -15
    }).toDestination();

    // Schedule metronome clicks (4/4 time signature)
    const id = Tone.Transport.scheduleRepeat((time) => {
      const position = Tone.Transport.position;
      const bar = parseInt(position.split(':')[0]);
      const beat = parseInt(position.split(':')[1]);
      
      // First beat of the bar gets the high click
      if (beat === 0) {
        highClick.start(time);
      } else {
        lowClick.start(time);
      }
    }, "4n"); // Quarter note interval

    setClickScheduleId(id);

    return () => {
      Tone.Transport.clear(id);
      highClick.dispose();
      lowClick.dispose();
    };
  }, [toneInitialized, active, bpm]);

  const toggleMetronome = () => {
    setActive(!active);
  };

  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={toggleMetronome}
      className={`h-7 px-2 ${active ? 'bg-cyber-purple hover:bg-cyber-purple/90' : 'bg-transparent'}`}
    >
      <Music className="h-3.5 w-3.5" />
    </Button>
  );
};

export default Metronome;
