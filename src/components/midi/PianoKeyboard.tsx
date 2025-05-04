
import React, { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSynth } from "@/hooks/useSynth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Volume2 } from "lucide-react";
import * as Tone from "tone";
import { usePatternRecorder } from "@/hooks/usePatternRecorder";

// Define range and white/black key mapping
const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_KEYS = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];
const KEY_WIDTH = 32; // Smaller key width for better fit
const KEY_HEIGHT = 120; // Shorter keys
const BLACK_KEY_HEIGHT = 70;
const BLACK_KEY_WIDTH = 20;

// Show one octave + C5 by default (C4 to C5)
const START_NOTE = 60; // MIDI note for C4
const NUM_KEYS = 13; // C4 to C5

// Map: key index => midi note
// C  C# D D# E  F  F# G G# A A# B  C
// 60 61 62 63 64 65 66 67 68 69 70 71 72

function getNoteLabel(note: number) {
  const noteIndex = note % 12;
  const octave = Math.floor(note / 12) - 1;
  
  // Get the note name based on its position in the octave
  let noteName = '';
  if (noteIndex === 0) noteName = 'C';
  else if (noteIndex === 1) noteName = 'C#';
  else if (noteIndex === 2) noteName = 'D';
  else if (noteIndex === 3) noteName = 'D#';
  else if (noteIndex === 4) noteName = 'E';
  else if (noteIndex === 5) noteName = 'F';
  else if (noteIndex === 6) noteName = 'F#';
  else if (noteIndex === 7) noteName = 'G';
  else if (noteIndex === 8) noteName = 'G#';
  else if (noteIndex === 9) noteName = 'A';
  else if (noteIndex === 10) noteName = 'A#';
  else if (noteIndex === 11) noteName = 'B';
  
  return `${noteName}${octave}`;
}

type PianoKeyboardProps = {
  onNoteOn?: (note: number, velocity: number) => void;
  onNoteOff?: (note: number) => void;
};

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ onNoteOn, onNoteOff }) => {
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [volume, setVolume] = useState<number>(80);
  const { playNote, stopNote, changeSynthType, currentSynth } = useSynth();
  const { isRecording } = usePatternRecorder();

  // Initialize audio context on component mount
  useEffect(() => {
    const initAudio = async () => {
      if (Tone.context.state !== "running") {
        try {
          await Tone.start();
        } catch (error) {
          console.error("Failed to initialize audio context:", error);
        }
      }
    };
    
    initAudio();
  }, []);

  // Given MIDI number, return if it's a white key
  const isWhite = useCallback((note: number) => {
    const n = note % 12;
    return [0,2,4,5,7,9,11].includes(n);
  }, []);

  // List of notes to show
  const notes = Array.from({length: NUM_KEYS}, (_, i) => START_NOTE + i);

  // Which keys to draw (for mapping white and black positions)
  const whiteNotes = notes.filter(isWhite);
  const blackNotes = notes.filter(n => !isWhite(n));

  // Press a key
  const handleDown = (note: number) => {
    if (!activeNotes.includes(note)) {
      setActiveNotes((prev) => [...prev, note]);
      onNoteOn?.(note, 100);
      playNote(note, 100); // Play sound!
    }
  };
  // Release a key
  const handleUp = (note: number) => {
    setActiveNotes((prev) => prev.filter((n) => n !== note));
    onNoteOff?.(note);
    stopNote(note); // Stop sound!
  };

  // Handle mouse/touch events
  const makeHandlers = (note: number) => ({
    onMouseDown: () => handleDown(note),
    onMouseUp:   () => handleUp(note),
    onMouseLeave: (e: React.MouseEvent) => {
      // Only trigger note off if mouse button is pressed
      if (e.buttons === 1) {
        handleUp(note);
      }
    },
    onTouchStart: (e: React.TouchEvent) => { e.preventDefault(); handleDown(note); },
    onTouchEnd:   () => handleUp(note),
  });

  // Keyboard accessibility (optional: only triggers note-on for C4)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "a") handleDown(60); // C4
    if (e.key === "w") handleDown(61); // C#4
    if (e.key === "s") handleDown(62); // D4
    if (e.key === "e") handleDown(63); // D#4
    if (e.key === "d") handleDown(64); // E4
    if (e.key === "f") handleDown(65); // F4
    if (e.key === "t") handleDown(66); // F#4
    if (e.key === "g") handleDown(67); // G4
    if (e.key === "y") handleDown(68); // G#4
    if (e.key === "h") handleDown(69); // A4
    if (e.key === "u") handleDown(70); // A#4
    if (e.key === "j") handleDown(71); // B4
    if (e.key === "k") handleDown(72); // C5
  };
  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === "a") handleUp(60);
    if (e.key === "w") handleUp(61);
    if (e.key === "s") handleUp(62);
    if (e.key === "e") handleUp(63);
    if (e.key === "d") handleUp(64);
    if (e.key === "f") handleUp(65);
    if (e.key === "t") handleUp(66);
    if (e.key === "g") handleUp(67);
    if (e.key === "y") handleUp(68);
    if (e.key === "h") handleUp(69);
    if (e.key === "u") handleUp(70);
    if (e.key === "j") handleUp(71);
    if (e.key === "k") handleUp(72);
  };

  // Handle synth type change
  const handleSynthChange = (value: string) => {
    changeSynthType(value as any);
  };

  // Handle volume change
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
    // Volume calculation (convert percentage to dB)
    const dbValue = ((values[0] / 100) * 40) - 40; // -40dB (silent) to 0dB (full)
    if (Tone.getDestination()) {
      Tone.getDestination().volume.value = dbValue;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center bg-cyber-darker/70 rounded-lg p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-cyber-purple/30">
        <h3 className={cn(
          "text-sm font-medium",
          isRecording ? "text-cyber-red animate-pulse" : "text-cyber-light-red"
        )}>
          {isRecording ? "Recording Active" : "Piano Keyboard"}
        </h3>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-cyber-purple/70" />
            <Slider 
              className="w-24" 
              value={[volume]} 
              min={0} 
              max={100} 
              step={1} 
              onValueChange={handleVolumeChange} 
            />
          </div>
          
          <Select defaultValue="basic" value={currentSynth} onValueChange={handleSynthChange}>
            <SelectTrigger className="w-[120px] h-8 text-xs bg-cyber-darker border-cyber-purple/30">
              <SelectValue placeholder="Synth Type" />
            </SelectTrigger>
            <SelectContent className="bg-cyber-darker border-cyber-purple/30">
              <SelectItem value="basic" className="text-xs">Basic Synth</SelectItem>
              <SelectItem value="fm" className="text-xs">FM Synth</SelectItem>
              <SelectItem value="am" className="text-xs">AM Synth</SelectItem>
              <SelectItem value="membrane" className="text-xs">Percussion</SelectItem>
              <SelectItem value="pluck" className="text-xs">Pluck Synth</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        className={cn(
          "relative w-fit mx-auto select-none touch-none bg-cyber-darker/40 p-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)]",
          isRecording && "border-2 border-cyber-red"
        )}
        tabIndex={0}
        aria-label="Piano Keyboard"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        style={{
          boxShadow: "0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)"
        }}
      >
        {/* White Keys */}
        <div className="flex z-10">
          {whiteNotes.map((note, idx) => (
            <div
              key={note}
              className={cn(
                "relative flex flex-col justify-end items-center transition-all",
                activeNotes.includes(note) ? 
                  "bg-gradient-to-b from-cyber-purple/90 to-cyber-purple/70 text-white shadow-lg" : 
                  "bg-gradient-to-b from-white to-white/90 hover:bg-cyber-light-red/10",
                "border border-gray-900/50",
                idx === 0 ? "rounded-l-sm" : "",
                idx === whiteNotes.length - 1 ? "rounded-r-sm" : "",
              )}
              style={{
                width: KEY_WIDTH,
                height: KEY_HEIGHT,
                marginLeft: idx === 0 ? 0 : -1,
                zIndex: 1,
                userSelect: "none",
                boxShadow: activeNotes.includes(note) ? 
                  "inset 0 -5px 10px rgba(0,0,0,0.2), 0 2px 10px rgba(0, 0, 0, 0.2)" : 
                  "inset 0 -10px 15px rgba(0,0,0,0.1), 0 0 1px rgba(0, 0, 0, 0.4)"
              }}
              {...makeHandlers(note)}
              role="button"
              aria-pressed={activeNotes.includes(note)}
              tabIndex={-1}
            >
              <span className={cn(
                "mb-2 pointer-events-none text-[10px]", 
                activeNotes.includes(note) ? "text-white font-bold" : "text-gray-500"
              )}>
                {getNoteLabel(note)}
              </span>
            </div>
          ))}
        </div>
        
        {/* Black Keys */}
        <div className="pointer-events-none absolute left-0 top-0 flex flex-row z-20" style={{height: BLACK_KEY_HEIGHT, width: whiteNotes.length * KEY_WIDTH}}>
          {/* Black keys are not rendered for E/B */}
          {notes.map((note, idx) => {
            const nInOct = note % 12;
            // E and B (4, 11) don't have sharps
            if ([1, 3, 6, 8, 10].includes(nInOct)) {
              // Position left over the gap between two white keys
              // Offset = (#whites left of this key) * KEY_WIDTH - half a black key
              const whitesLeft = notes.slice(0, idx + 1).filter(isWhite).length - 1;
              return (
                <div
                  key={note}
                  className={cn(
                    "absolute border border-gray-800/80",
                    activeNotes.includes(note) ? 
                      "bg-gradient-to-b from-cyber-red to-cyber-red/80" : 
                      "bg-gradient-to-b from-black to-gray-800"
                  )}
                  style={{
                    left: whitesLeft * KEY_WIDTH - BLACK_KEY_WIDTH / 2,
                    width: BLACK_KEY_WIDTH,
                    height: BLACK_KEY_HEIGHT,
                    borderRadius: "0 0 4px 4px",
                    zIndex: 2,
                    userSelect: "none",
                    cursor: "pointer",
                    pointerEvents: "auto",
                    boxShadow: activeNotes.includes(note) ? 
                      "inset 0 -5px 8px rgba(0,0,0,0.3), 0 1px 1px rgba(255, 255, 255, 0.1)" : 
                      "inset 0 -8px 10px rgba(0,0,0,0.4), 0 3px 5px rgba(0, 0, 0, 0.5)"
                  }}
                  onMouseDown={() => handleDown(note)}
                  onMouseUp={() => handleUp(note)}
                  onMouseLeave={(e) => {
                    // Only trigger note off if mouse button is pressed
                    if (e.buttons === 1) {
                      handleUp(note);
                    }
                  }}
                  onTouchStart={e => { e.preventDefault(); handleDown(note); }}
                  onTouchEnd={() => handleUp(note)}
                  role="button"
                  aria-pressed={activeNotes.includes(note)}
                  tabIndex={-1}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
      <div className="text-xs text-cyber-purple/60 text-center">
        Use your QWERTY keyboard: A=C4, W=C#4, S=D4, etc.
        {isRecording && <div className="text-cyber-red mt-1">Recording active! Notes will be captured.</div>}
      </div>
    </div>
  );
};

export default PianoKeyboard;
