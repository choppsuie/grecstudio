
import React from 'react';
import MIDIController from '../midi/MIDIController';
import PianoKeyboard from '../midi/PianoKeyboard';
import { useStudio } from '@/contexts/StudioContext';
import { Separator } from '@/components/ui/separator';

const MIDIKeyboardPanel = () => {
  const { handleMIDINoteOn, handleMIDINoteOff } = useStudio();
  
  return (
    <div className="flex flex-col gap-4 p-4 bg-cyber-dark rounded-md border border-cyber-purple/30">
      <h3 className="text-lg font-semibold text-cyber-purple">MIDI Keyboard</h3>
      
      <Separator className="bg-cyber-purple/20" />
      
      <PianoKeyboard 
        onNoteOn={handleMIDINoteOn}
        onNoteOff={handleMIDINoteOff}
      />
      
      <Separator className="bg-cyber-purple/20" />
      
      <MIDIController 
        onNoteOn={handleMIDINoteOn}
        onNoteOff={handleMIDINoteOff}
      />
    </div>
  );
};

export default MIDIKeyboardPanel;
