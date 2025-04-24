
export const KEY_WIDTH = 32;
export const KEY_HEIGHT = 120;
export const BLACK_KEY_HEIGHT = 70;
export const BLACK_KEY_WIDTH = 20;
export const START_NOTE = 60;
export const NUM_KEYS = 13;

export function getNoteLabel(note: number): string {
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

export const isWhiteKey = (note: number): boolean => {
  const n = note % 12;
  return [0,2,4,5,7,9,11].includes(n);
};

export const createNoteList = () => {
  const notes = Array.from({length: NUM_KEYS}, (_, i) => START_NOTE + i);
  const whiteNotes = notes.filter(isWhiteKey);
  const blackNotes = notes.filter(n => !isWhiteKey(n));
  return { notes, whiteNotes, blackNotes };
};
