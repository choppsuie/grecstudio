
declare namespace WebMidi {
  interface MIDIOptions {
    sysex?: boolean;
    software?: boolean;
  }

  interface MIDIAccess extends EventTarget {
    inputs: MIDIInputMap;
    outputs: MIDIOutputMap;
    onstatechange: ((evt: MIDIConnectionEvent) => void) | null;
    sysexEnabled: boolean;
  }

  interface MIDIPort extends EventTarget {
    id: string;
    manufacturer?: string;
    name?: string;
    type: 'input' | 'output';
    version?: string;
    state: 'connected' | 'disconnected' | 'pending';
    connection: 'open' | 'closed' | 'pending';
    onstatechange: ((evt: MIDIConnectionEvent) => void) | null;
    open(): Promise<MIDIPort>;
    close(): Promise<MIDIPort>;
  }

  interface MIDIInput extends MIDIPort {
    type: 'input';
    onmidimessage: ((evt: MIDIMessageEvent) => void) | null;
  }

  interface MIDIOutput extends MIDIPort {
    type: 'output';
    send(data: Uint8Array | number[], timestamp?: DOMHighResTimeStamp): void;
    clear(): void;
  }

  interface MIDIInputMap {
    entries(): IterableIterator<[string, MIDIInput]>;
    forEach(callback: (input: MIDIInput, key: string, map: MIDIInputMap) => void): void;
    get(id: string): MIDIInput | undefined;
    has(id: string): boolean;
    keys(): IterableIterator<string>;
    size: number;
    values(): IterableIterator<MIDIInput>;
    [Symbol.iterator](): IterableIterator<[string, MIDIInput]>;
  }

  interface MIDIOutputMap {
    entries(): IterableIterator<[string, MIDIOutput]>;
    forEach(callback: (output: MIDIOutput, key: string, map: MIDIOutputMap) => void): void;
    get(id: string): MIDIOutput | undefined;
    has(id: string): boolean;
    keys(): IterableIterator<string>;
    size: number;
    values(): IterableIterator<MIDIOutput>;
    [Symbol.iterator](): IterableIterator<[string, MIDIOutput]>;
  }

  interface MIDIMessageEvent extends Event {
    receivedTime: DOMHighResTimeStamp;
    data: Uint8Array;
  }

  interface MIDIConnectionEvent extends Event {
    port: MIDIPort;
  }
}

interface Navigator {
  requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>;
}
