
import React, { useState, useCallback } from "react";
import { useSynth } from "@/hooks/useSynth";
import * as Tone from "tone";
import Key from "./Key";
import SynthControls from "./SynthControls";
import { KEY_WIDTH, KEY_HEIGHT, BLACK_KEY_HEIGHT, BLACK_KEY_WIDTH, createNoteList, getNoteLabel, isWhiteKey } from "./utils";

type PianoKeyboardProps = {
  onNoteOn?: (note: number, velocity: number) => void;
  onNoteOff?: (note: number) => void;
};

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ onNoteOn, onNoteOff }) => {
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [volume, setVolume] = useState<number>(80);
  const { playNote, stopNote, changeSynthType, currentSynth } = useSynth();
  const { notes, whiteNotes, blackNotes } = createNoteList();

  // Press a key
  const handleDown = useCallback((note: number) => {
    if (!activeNotes.includes(note)) {
      setActiveNotes((prev) => [...prev, note]);
      onNoteOn?.(note, 100);
      playNote(note, 100);
    }
  }, [activeNotes, onNoteOn, playNote]);

  // Release a key
  const handleUp = useCallback((note: number) => {
    setActiveNotes((prev) => prev.filter((n) => n !== note));
    onNoteOff?.(note);
    stopNote(note);
  }, [onNoteOff, stopNote]);

  // Keyboard accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const keyMap: { [key: string]: number } = {
      a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66,
      g: 67, y: 68, h: 69, u: 70, j: 71, k: 72
    };
    if (keyMap[e.key]) handleDown(keyMap[e.key]);
  }, [handleDown]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    const keyMap: { [key: string]: number } = {
      a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66,
      g: 67, y: 68, h: 69, u: 70, j: 71, k: 72
    };
    if (keyMap[e.key]) handleUp(keyMap[e.key]);
  }, [handleUp]);

  // Handle synth changes
  const handleSynthChange = (value: string) => {
    changeSynthType(value as any);
  };

  // Handle volume change
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
    const dbValue = ((values[0] / 100) * 40) - 40;
    if (Tone.getDestination()) {
      Tone.getDestination().volume.value = dbValue;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center bg-cyber-darker/70 rounded-lg p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-cyber-purple/30">
        <h3 className="text-sm font-medium text-cyber-light-red">Piano Keyboard</h3>
        <SynthControls
          currentSynth={currentSynth}
          volume={volume}
          onSynthChange={handleSynthChange}
          onVolumeChange={handleVolumeChange}
        />
      </div>

      <div
        className="relative w-fit mx-auto select-none touch-none bg-cyber-darker/40 p-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
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
            <Key
              key={note}
              note={note}
              isWhite={true}
              isActive={activeNotes.includes(note)}
              keyWidth={KEY_WIDTH}
              keyHeight={KEY_HEIGHT}
              label={getNoteLabel(note)}
              onMouseDown={() => handleDown(note)}
              onMouseUp={() => handleUp(note)}
              onMouseLeave={() => handleUp(note)}
              onTouchStart={(e) => { e.preventDefault(); handleDown(note); }}
              onTouchEnd={() => handleUp(note)}
            />
          ))}
        </div>
        
        {/* Black Keys */}
        <div className="pointer-events-none absolute left-0 top-0 flex flex-row z-20" style={{height: BLACK_KEY_HEIGHT, width: whiteNotes.length * KEY_WIDTH}}>
          {notes.map((note, idx) => {
            const nInOct = note % 12;
            if ([1, 3, 6, 8, 10].includes(nInOct)) {
              const whitesLeft = notes.slice(0, idx + 1).filter(isWhiteKey).length - 1;
              return (
                <Key
                  key={note}
                  note={note}
                  isWhite={false}
                  isActive={activeNotes.includes(note)}
                  keyWidth={KEY_WIDTH}
                  keyHeight={KEY_HEIGHT}
                  blackKeyWidth={BLACK_KEY_WIDTH}
                  blackKeyHeight={BLACK_KEY_HEIGHT}
                  position={{ left: whitesLeft * KEY_WIDTH - BLACK_KEY_WIDTH / 2 }}
                  label=""
                  onMouseDown={() => handleDown(note)}
                  onMouseUp={() => handleUp(note)}
                  onMouseLeave={() => handleUp(note)}
                  onTouchStart={(e) => { e.preventDefault(); handleDown(note); }}
                  onTouchEnd={() => handleUp(note)}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
      <div className="text-xs text-cyber-purple/60 text-center">
        Use your QWERTY keyboard: A=C4, W=C#4, S=D4, etc.
      </div>
    </div>
  );
};

export default PianoKeyboard;
