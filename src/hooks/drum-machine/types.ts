
import * as Tone from "tone";

export type DrumKitType = "basic" | "tr808" | "tr909" | "acoustic";

export interface DrumPad {
  id: string;
  name: string;
  soundUrl: string;
  color: string;
  key: string;
}

export interface DrumKit {
  id: DrumKitType;
  name: string;
  pads: DrumPad[];
}

export interface DrumKitInfo {
  id: DrumKitType;
  name: string;
}

export interface DrumMachineState {
  selectedKit: DrumKitType;
  players: Record<string, Tone.Player>;
  isLoaded: boolean;
  mainVolume: Tone.Volume | null;
}
