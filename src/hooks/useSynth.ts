
import { useRef, useState } from "react";
import * as Tone from "tone";

type PlayNote = (midi: number, velocity?: number) => void;
type StopNote = (midi: number) => void;
type SynthType = "basic" | "fm" | "am" | "membrane" | "pluck";

/**
 * Enhanced PolySynth hook for piano/keyboard playback via Tone.js.
 * Supports multiple synth types for different sounds.
 * Usage: const { playNote, stopNote, changeSynthType, currentSynth } = useSynth();
 */
export function useSynth() {
  // Keep synth instance across renders
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const [currentSynth, setCurrentSynth] = useState<SynthType>("basic");
  
  const createSynth = (type: SynthType) => {
    // Dispose old synth if it exists
    if (synthRef.current) {
      synthRef.current.dispose();
    }
    
    let synthOptions = {};
    let synthClass = Tone.Synth;
    
    // Configure synth based on type
    switch (type) {
      case "fm":
        synthClass = Tone.FMSynth;
        synthOptions = {
          modulationIndex: 10,
          harmonicity: 3.01
        };
        break;
      case "am":
        synthClass = Tone.AMSynth;
        synthOptions = {
          harmonicity: 2.5
        };
        break;
      case "membrane":
        synthClass = Tone.MembraneSynth;
        synthOptions = {
          octaves: 4,
          pitchDecay: 0.1
        };
        break;
      case "pluck":
        synthClass = Tone.PluckSynth;
        synthOptions = {
          attackNoise: 1,
          dampening: 4000,
          resonance: 0.7
        };
        break;
      default: // "basic"
        synthOptions = {
          oscillator: {
            type: "triangle8"
          },
          envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.2,
            release: 0.8,
          }
        };
    }
    
    // Create new synth
    synthRef.current = new Tone.PolySynth(synthClass, {
      volume: -8, // softer default
      ...synthOptions
    }).toDestination();
    
    // Add reverb for more pleasing sound
    const reverb = new Tone.Reverb(1.5).toDestination();
    synthRef.current.connect(reverb);
    
    return synthRef.current;
  };
  
  // Initialize synth if it doesn't exist
  if (!synthRef.current) {
    createSynth(currentSynth);
  }

  // Change synth type
  const changeSynthType = (type: SynthType) => {
    setCurrentSynth(type);
    createSynth(type);
  };

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

  return { playNote, stopNote, changeSynthType, currentSynth };
}
