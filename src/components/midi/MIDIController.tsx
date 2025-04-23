
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MIDINote {
  note: number;
  velocity: number;
  timestamp: number;
}

const MIDIController = ({ onNoteOn, onNoteOff }: {
  onNoteOn?: (note: number, velocity: number) => void;
  onNoteOff?: (note: number) => void;
}) => {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [midiInputs, setMidiInputs] = useState<WebMidi.MIDIInput[]>([]);
  const [selectedInput, setSelectedInput] = useState<WebMidi.MIDIInput | null>(null);
  const [connected, setConnected] = useState(false);
  const [recentNotes, setRecentNotes] = useState<MIDINote[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Web MIDI API is supported
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then(access => {
          setMidiAccess(access);
          
          // Get list of inputs
          const inputs: WebMidi.MIDIInput[] = [];
          access.inputs.forEach(input => {
            inputs.push(input);
          });
          setMidiInputs(inputs);
          
          // Listen for state changes
          access.onstatechange = (e) => {
            const event = e as WebMidi.MIDIConnectionEvent;
            if (event.port.type === 'input') {
              if (event.port.state === 'connected') {
                toast({
                  title: "MIDI device connected",
                  description: `${event.port.name || 'Unknown device'} is now available`,
                });
                // Update inputs list
                const updatedInputs: WebMidi.MIDIInput[] = [];
                access.inputs.forEach(input => {
                  updatedInputs.push(input);
                });
                setMidiInputs(updatedInputs);
              } else if (event.port.state === 'disconnected') {
                toast({
                  title: "MIDI device disconnected",
                  description: `${event.port.name || 'Unknown device'} was disconnected`,
                  variant: "destructive"
                });
                // Update inputs list
                const updatedInputs: WebMidi.MIDIInput[] = [];
                access.inputs.forEach(input => {
                  updatedInputs.push(input);
                });
                setMidiInputs(updatedInputs);
                
                // If the disconnected device was the selected one, clear selection
                if (selectedInput && selectedInput.id === event.port.id) {
                  setSelectedInput(null);
                  setConnected(false);
                }
              }
            }
          };
        })
        .catch(err => {
          console.error("Failed to access MIDI devices:", err);
          toast({
            title: "MIDI Access Failed",
            description: "Could not access MIDI devices. Please check browser permissions.",
            variant: "destructive"
          });
        });
    } else {
      toast({
        title: "MIDI Not Supported",
        description: "Your browser doesn't support the Web MIDI API. Try using Chrome or Edge.",
        variant: "destructive"
      });
    }
    
    return () => {
      // Cleanup any MIDI connections
      if (selectedInput) {
        selectedInput.onmidimessage = null;
      }
    };
  }, [toast]);
  
  const connectToInput = (input: WebMidi.MIDIInput) => {
    if (selectedInput) {
      // Remove listener from previous input
      selectedInput.onmidimessage = null;
    }
    
    // Set up listener for the selected input
    input.onmidimessage = handleMIDIMessage;
    setSelectedInput(input);
    setConnected(true);
    
    toast({
      title: "MIDI Connected",
      description: `Now listening to ${input.name || 'selected device'}`,
    });
  };
  
  const handleMIDIMessage = (message: WebMidi.MIDIMessageEvent) => {
    const data = message.data;
    const cmd = data[0] >> 4;
    const channel = data[0] & 0xf;
    const noteNumber = data[1];
    const velocity = data[2];
    
    // Note on
    if (cmd === 9 && velocity > 0) {
      onNoteOn?.(noteNumber, velocity);
      // Add to recent notes
      setRecentNotes(prev => {
        const newNotes = [
          { note: noteNumber, velocity, timestamp: Date.now() },
          ...prev.slice(0, 9) // Keep only most recent 10 notes
        ];
        return newNotes;
      });
    } 
    // Note off
    else if (cmd === 8 || (cmd === 9 && velocity === 0)) {
      onNoteOff?.(noteNumber);
    }
  };
  
  // Utility function to convert MIDI note number to note name
  const getNoteNameFromNumber = (noteNum: number): string => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(noteNum / 12) - 1;
    const noteName = notes[noteNum % 12];
    return `${noteName}${octave}`;
  };
  
  return (
    <div className="p-4 bg-cyber-darker border border-cyber-purple/20 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">MIDI Controller</h3>
      
      {midiInputs.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {midiInputs.map((input, index) => (
              <Button
                key={input.id}
                onClick={() => connectToInput(input)}
                variant={selectedInput?.id === input.id ? "default" : "outline"}
                className={selectedInput?.id === input.id ? "bg-cyber-purple hover:bg-cyber-purple/90" : "border-cyber-purple/40"}
              >
                {input.name || `MIDI Input ${index + 1}`}
              </Button>
            ))}
          </div>
          
          {connected && (
            <div>
              <h4 className="text-sm font-medium mb-2">Recent MIDI Notes</h4>
              <div className="h-32 overflow-y-auto bg-cyber-dark/60 rounded p-2">
                {recentNotes.length > 0 ? (
                  <div className="space-y-1">
                    {recentNotes.map((note, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span>{getNoteNameFromNumber(note.note)}</span>
                        <span>Velocity: {note.velocity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-white/40 text-sm">Play some notes to see them here</p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-white/60 mb-4">No MIDI devices detected</p>
          <Button 
            onClick={() => {
              if (midiAccess) {
                // Refresh the list
                const updatedInputs: WebMidi.MIDIInput[] = [];
                midiAccess.inputs.forEach(input => {
                  updatedInputs.push(input);
                });
                setMidiInputs(updatedInputs);
                
                toast({
                  title: "Refreshed MIDI devices",
                  description: updatedInputs.length > 0 
                    ? `Found ${updatedInputs.length} device(s)` 
                    : "No devices found. Please connect a MIDI device."
                });
              }
            }}
          >
            Refresh Devices
          </Button>
        </div>
      )}
    </div>
  );
};

export default MIDIController;
