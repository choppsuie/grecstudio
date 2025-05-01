
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export type MIDICallback = (note: number, velocity: number) => void;

export const useMIDI = (onNoteOn?: MIDICallback, onNoteOff?: MIDICallback) => {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [midiInputs, setMidiInputs] = useState<WebMidi.MIDIInput[]>([]);
  const [activeInput, setActiveInput] = useState<WebMidi.MIDIInput | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initMIDI = async () => {
      if (!navigator.requestMIDIAccess) {
        toast({
          title: "MIDI not supported",
          description: "Your browser doesn't support the Web MIDI API.",
          variant: "destructive"
        });
        return;
      }

      try {
        const access = await navigator.requestMIDIAccess();
        setMidiAccess(access);

        const inputs: WebMidi.MIDIInput[] = [];
        access.inputs.forEach(input => {
          inputs.push(input);
        });
        setMidiInputs(inputs);

        if (inputs.length > 0) {
          toast({
            title: "MIDI devices found",
            description: `${inputs.length} MIDI devices available`
          });
        }

        access.onstatechange = (e) => {
          const event = e as WebMidi.MIDIConnectionEvent;
          console.log('MIDI state change:', event.port.state, event.port.name);
          
          // Update inputs list when devices connect/disconnect
          const updatedInputs: WebMidi.MIDIInput[] = [];
          access.inputs.forEach(input => {
            updatedInputs.push(input);
          });
          setMidiInputs(updatedInputs);
          
          // Handle device connection/disconnection
          if (event.port.type === 'input') {
            if (event.port.state === 'connected') {
              toast({
                title: "MIDI device connected",
                description: event.port.name || "Unknown device"
              });
            } else {
              toast({
                title: "MIDI device disconnected",
                description: event.port.name || "Unknown device",
                variant: "destructive"
              });
              
              // If active device disconnected, clear selection
              if (activeInput && activeInput.id === event.port.id) {
                setActiveInput(null);
                setIsConnected(false);
              }
            }
          }
        };
      } catch (err) {
        toast({
          title: "MIDI access failed",
          description: "Failed to access MIDI devices",
          variant: "destructive"
        });
        console.error('MIDI access error:', err);
      }
    };

    initMIDI();
    
    return () => {
      // Clean up any MIDI connections
      if (activeInput) {
        activeInput.onmidimessage = null;
      }
    };
  }, [toast]);

  const connectInput = (input: WebMidi.MIDIInput) => {
    if (activeInput) {
      activeInput.onmidimessage = null;
    }
    
    input.onmidimessage = handleMIDIMessage;
    setActiveInput(input);
    setIsConnected(true);
    
    toast({
      title: "MIDI connected",
      description: `Connected to ${input.name || 'MIDI device'}`
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
    } 
    // Note off
    else if (cmd === 8 || (cmd === 9 && velocity === 0)) {
      // Fix: Pass the velocity (0) as the second argument, as required by the type
      onNoteOff?.(noteNumber, 0);
    }
  };
  
  return {
    midiInputs,
    activeInput,
    isConnected,
    connectInput
  };
};
