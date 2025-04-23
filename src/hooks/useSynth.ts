import { useRef } from "react";
import * as Tone from "tone";

type PlayNote = (midi: number, velocity?: number) => void;
type StopNote = (midi: number) => void;

/**
 * Simple PolySynth hook for piano/keyboard playback via Tone.js.
 * Usage: const { playNote, stopNote } = useSynth();
 */
export function useSynth() {
  // Keep synth instance across renders
  const synthRef = useRef<Tone.PolySynth | null>(null);

  if (!synthRef.current) {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      volume: -8, // softer default
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.2,
        release: 0.8,
      }
    }).toDestination();
  }

  // Helper functions: MIDI note number -> "C4" etc.
  const playNote: PlayNote = (midi, velocity = 100) => {
    Tone.start();
    // convert MIDI number to note like "C4"
    const note = Tone.Frequency(midi, "midi").toNote();
    // velocity: 0-127, Tone.js: 0-1
    synthRef.current!.triggerAttack(note, undefined, velocity / 127);
  };

  const stopNote: StopNote = (midi) => {
    const note = Tone.Frequency(midi, "midi").toNote();
    synthRef.current!.triggerRelease(note);
  };

  return { playNote, stopNote };
}
