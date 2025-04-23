import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useSynth } from "@/hooks/useSynth";

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
  const { playNote, stopNote } = useSynth();

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
    onMouseLeave: () => handleUp(note),
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

  return (
    <div
      className="relative w-fit mx-auto select-none touch-none"
      tabIndex={0}
      aria-label="Piano Keyboard"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {/* White Keys */}
      <div className="flex z-10">
        {whiteNotes.map((note, idx) => (
          <div
            key={note}
            className={cn(
              "border border-gray-900 bg-white/90 text-xs relative flex flex-col justify-end items-center",
              "transition-colors",
              activeNotes.includes(note) ? "bg-cyber-purple/90 text-white shadow-2xl" : "hover:bg-cyber-light-red/40",
              idx === 0 ? "rounded-l-sm" : "",
              idx === whiteNotes.length - 1 ? "rounded-r-sm" : "",
            )}
            style={{
              width: KEY_WIDTH,
              height: KEY_HEIGHT,
              marginLeft: idx === 0 ? 0 : -1,
              zIndex: 1,
              userSelect: "none"
            }}
            {...makeHandlers(note)}
            role="button"
            aria-pressed={activeNotes.includes(note)}
            tabIndex={-1}
          >
            <span className={cn("mb-2 pointer-events-none text-[10px]", activeNotes.includes(note) ? "text-white font-bold" : "text-gray-500")}>
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
                  "absolute border border-gray-700 bg-black",
                  activeNotes.includes(note) ? "bg-cyber-purple" : ""
                )}
                style={{
                  left: whitesLeft * KEY_WIDTH - BLACK_KEY_WIDTH / 2,
                  width: BLACK_KEY_WIDTH,
                  height: BLACK_KEY_HEIGHT,
                  borderRadius: "0 0 2px 2px",
                  zIndex: 2,
                  userSelect: "none",
                  cursor: "pointer",
                  pointerEvents: "auto"
                }}
                onMouseDown={() => handleDown(note)}
                onMouseUp={() => handleUp(note)}
                onMouseLeave={() => handleUp(note)}
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
  );
};

export default PianoKeyboard;
