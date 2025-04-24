
import { useRef, useState } from "react";
import * as Tone from "tone";

type PlayNote = (midi: number, velocity?: number) => void;
type StopNote = (midi: number) => void;
type SynthType = "basic" | "fm" | "am" | "membrane" | "pluck" | "duo" | "metal" | "piano";

export function useSynth() {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const [currentSynth, setCurrentSynth] = useState<SynthType>("basic");
  
  const createSynth = (type: SynthType) => {
    if (synthRef.current) {
      synthRef.current.dispose();
    }
    
    switch (type) {
      case "fm":
        synthRef.current = new Tone.PolySynth(Tone.FMSynth).toDestination();
        synthRef.current.set({
          volume: -8,
          modulationIndex: 10,
          harmonicity: 3.01
        });
        break;
      case "am":
        synthRef.current = new Tone.PolySynth(Tone.AMSynth).toDestination();
        synthRef.current.set({
          volume: -8,
          harmonicity: 2.5
        });
        break;
      case "membrane":
        synthRef.current = new Tone.PolySynth(Tone.MembraneSynth).toDestination();
        synthRef.current.set({
          volume: -8,
          octaves: 4,
          pitchDecay: 0.1
        });
        break;
      case "duo":
        synthRef.current = new Tone.PolySynth(Tone.DuoSynth).toDestination();
        synthRef.current.set({
          volume: -12,
          vibratoAmount: 0.5,
          harmonicity: 1.5,
        });
        break;
      case "metal":
        synthRef.current = new Tone.PolySynth(Tone.MetalSynth).toDestination();
        synthRef.current.set({
          volume: -15,
          resonance: 100,
          harmonicity: 5.1
        });
        break;
      case "piano":
        synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
        synthRef.current.set({
          volume: -8,
          oscillator: {
            type: "sine"
          },
          envelope: {
            attack: 0.005,
            decay: 3,
            sustain: 0,
            release: 1
          }
        });
        break;
      case "pluck":
        // Handle pluck synth differently due to its unique architecture
        const pluck = new Tone.PluckSynth({
          attackNoise: 1,
          dampening: 4000,
          resonance: 0.95
        }).toDestination();
        synthRef.current = new Tone.PolySynth().toDestination();
        synthRef.current.set({
          volume: -8
        });
        break;
      default: // "basic"
        synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
        synthRef.current.set({
          volume: -8,
          oscillator: {
            type: "triangle8"
          },
          envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.2,
            release: 0.8,
          }
        });
    }
    
    const reverb = new Tone.Reverb(1.5).toDestination();
    synthRef.current.connect(reverb);
  };
  
  if (!synthRef.current) {
    createSynth(currentSynth);
  }

  const changeSynthType = (type: SynthType) => {
    setCurrentSynth(type);
    createSynth(type);
  };

  const playNote: PlayNote = (midi, velocity = 100) => {
    Tone.start();
    const note = Tone.Frequency(midi, "midi").toNote();
    synthRef.current!.triggerAttack(note, undefined, velocity / 127);
  };

  const stopNote: StopNote = (midi) => {
    const note = Tone.Frequency(midi, "midi").toNote();
    synthRef.current!.triggerRelease(note);
  };

  return { playNote, stopNote, changeSynthType, currentSynth };
}
