
import { useRef, useState } from "react";
import * as Tone from "tone";

type SynthType = "basic" | "fm" | "am" | "membrane" | "pluck" | "duo" | "metal" | "piano";

// Generic type for any Tone.js synth
type ToneSynth = Tone.PolySynth<any>;

export function useSynth() {
  const synthRef = useRef<ToneSynth | null>(null);
  const [currentSynth, setCurrentSynth] = useState<SynthType>("basic");
  
  const createSynth = (type: SynthType) => {
    if (synthRef.current) {
      synthRef.current.dispose();
    }
    
    let newSynth: ToneSynth;
    
    switch (type) {
      case "fm":
        newSynth = new Tone.PolySynth(Tone.FMSynth).toDestination();
        newSynth.set({
          volume: -8,
          modulationIndex: 10,
          harmonicity: 3.01
        });
        break;
      case "am":
        newSynth = new Tone.PolySynth(Tone.AMSynth).toDestination();
        newSynth.set({
          volume: -8,
          harmonicity: 2.5
        });
        break;
      case "membrane":
        newSynth = new Tone.PolySynth(Tone.MembraneSynth).toDestination();
        newSynth.set({
          volume: -8,
          octaves: 4,
          pitchDecay: 0.1
        });
        break;
      case "duo":
        newSynth = new Tone.PolySynth(Tone.DuoSynth).toDestination();
        newSynth.set({
          volume: -12,
          harmonicity: 1.5,
          oscillator: {
            type: "sine"
          }
        });
        break;
      case "metal":
        newSynth = new Tone.PolySynth(Tone.MetalSynth).toDestination();
        newSynth.set({
          volume: -15,
          resonance: 100,
          harmonicity: 5.1
        });
        break;
      case "piano":
        newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
        newSynth.set({
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
        newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
        newSynth.set({
          volume: -8,
          envelope: {
            attack: 0.001,
            decay: 1.5,
            sustain: 0,
            release: 1.5
          }
        });
        break;
      default: // "basic"
        newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
        newSynth.set({
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
    newSynth.connect(reverb);
    synthRef.current = newSynth;
  };
  
  if (!synthRef.current) {
    createSynth(currentSynth);
  }

  const changeSynthType = (type: SynthType) => {
    setCurrentSynth(type);
    createSynth(type);
  };

  const playNote = (midi: number, velocity = 100) => {
    Tone.start();
    const note = Tone.Frequency(midi, "midi").toNote();
    synthRef.current!.triggerAttack(note, undefined, velocity / 127);
  };

  const stopNote = (midi: number) => {
    const note = Tone.Frequency(midi, "midi").toNote();
    synthRef.current!.triggerRelease(note);
  };

  return { playNote, stopNote, changeSynthType, currentSynth };
}
