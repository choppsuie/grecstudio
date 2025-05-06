
import { DrumKit, DrumKitType } from './types';

// Define sound libraries for different drum kits
const drumKits: Record<DrumKitType, DrumKit> = {
  basic: {
    id: "basic",
    name: "Basic Kit",
    pads: [
      { id: "kick", name: "Kick", soundUrl: "https://tonejs.github.io/audio/drum-samples/breakbeat8/kick.mp3", color: "#F9636F", key: "1" },
      { id: "snare", name: "Snare", soundUrl: "https://tonejs.github.io/audio/drum-samples/breakbeat8/snare.mp3", color: "#8B5CF6", key: "2" },
      { id: "hihat", name: "Hi-Hat", soundUrl: "https://tonejs.github.io/audio/drum-samples/breakbeat8/hihat.mp3", color: "#0CFCFC", key: "3" },
      { id: "clap", name: "Clap", soundUrl: "https://tonejs.github.io/audio/drum-samples/breakbeat8/clap.mp3", color: "#F97316", key: "4" },
      { id: "tom1", name: "Tom 1", soundUrl: "https://tonejs.github.io/audio/drum-samples/breakbeat8/tom1.mp3", color: "#3C71D0", key: "q" },
      { id: "tom2", name: "Tom 2", soundUrl: "https://tonejs.github.io/audio/drum-samples/breakbeat8/tom2.mp3", color: "#D946EF", key: "w" },
      { id: "crash", name: "Crash", soundUrl: "https://tonejs.github.io/audio/berklee/cymbal.mp3", color: "#0EA5E9", key: "e" },
      { id: "ride", name: "Ride", soundUrl: "https://tonejs.github.io/audio/berklee/cymbal_ride.mp3", color: "#ED213A", key: "r" },
      { id: "perc1", name: "Perc 1", soundUrl: "https://tonejs.github.io/audio/drum-samples/breakbeat8/tom3.mp3", color: "#F9636F", key: "a" },
      { id: "perc2", name: "Perc 2", soundUrl: "https://tonejs.github.io/audio/drum-samples/breakbeat8/snare-rim.mp3", color: "#8B5CF6", key: "s" },
      { id: "fx1", name: "FX 1", soundUrl: "https://tonejs.github.io/audio/berklee/glass.mp3", color: "#0CFCFC", key: "d" },
      { id: "fx2", name: "FX 2", soundUrl: "https://tonejs.github.io/audio/berklee/metal.mp3", color: "#F97316", key: "f" },
    ]
  },
  tr808: {
    id: "tr808",
    name: "TR-808",
    pads: [
      { id: "kick", name: "808 Kick", soundUrl: "https://tonejs.github.io/audio/drum-samples/808/kick.mp3", color: "#FF3131", key: "1" },
      { id: "snare", name: "808 Snare", soundUrl: "https://tonejs.github.io/audio/drum-samples/808/snare.mp3", color: "#FF5E5E", key: "2" },
      { id: "clap", name: "808 Clap", soundUrl: "https://tonejs.github.io/audio/drum-samples/808/clap.mp3", color: "#FF8A8A", key: "3" },
      { id: "rimshot", name: "Rimshot", soundUrl: "https://tonejs.github.io/audio/drum-samples/808/808-rim.mp3", color: "#FFB6B6", key: "4" },
      { id: "closedhat", name: "Closed Hat", soundUrl: "https://tonejs.github.io/audio/drum-samples/808/hihat-closed.mp3", color: "#4D4DFF", key: "q" },
      { id: "openhat", name: "Open Hat", soundUrl: "https://tonejs.github.io/audio/drum-samples/808/hihat-open.mp3", color: "#7979FF", key: "w" },
      { id: "cowbell", name: "Cowbell", soundUrl: "https://tonejs.github.io/audio/drum-samples/808/808-cowbell.mp3", color: "#A5A5FF", key: "e" },
      { id: "conga", name: "Conga", soundUrl: "https://tonejs.github.io/audio/drum-samples/808/808-conga.mp3", color: "#D1D1FF", key: "r" },
      { id: "tom", name: "808 Tom", soundUrl: "https://tonejs.github.io/audio/drum-samples/808/tom.mp3", color: "#00CC00", key: "a" },
      { id: "maracas", name: "Maracas", soundUrl: "https://tonejs.github.io/audio/drum-samples/808/808-maracas.mp3", color: "#33FF33", key: "s" },
      { id: "cymbal", name: "Cymbal", soundUrl: "https://tonejs.github.io/audio/drum-samples/808/808-cymbal.mp3", color: "#66FF66", key: "d" },
      { id: "claves", name: "Claves", soundUrl: "https://tonejs.github.io/audio/drum-samples/808/808-clav.mp3", color: "#99FF99", key: "f" },
    ]
  },
  tr909: {
    id: "tr909",
    name: "TR-909",
    pads: [
      { id: "kick", name: "909 Kick", soundUrl: "https://tonejs.github.io/audio/drum-samples/909/kick.mp3", color: "#FF8000", key: "1" },
      { id: "snare", name: "909 Snare", soundUrl: "https://tonejs.github.io/audio/drum-samples/909/snare.mp3", color: "#FFA040", key: "2" },
      { id: "clap", name: "909 Clap", soundUrl: "https://tonejs.github.io/audio/drum-samples/909/clap.mp3", color: "#FFC080", key: "3" },
      { id: "rim", name: "909 Rim", soundUrl: "https://tonejs.github.io/audio/drum-samples/909/rim.mp3", color: "#FFE0C0", key: "4" },
      { id: "closedhat", name: "909 CH", soundUrl: "https://tonejs.github.io/audio/drum-samples/909/hihat-closed.mp3", color: "#8000FF", key: "q" },
      { id: "openhat", name: "909 OH", soundUrl: "https://tonejs.github.io/audio/drum-samples/909/hihat-open.mp3", color: "#A040FF", key: "w" },
      { id: "crash", name: "909 Crash", soundUrl: "https://tonejs.github.io/audio/drum-samples/909/crash.mp3", color: "#C080FF", key: "e" },
      { id: "ride", name: "909 Ride", soundUrl: "https://tonejs.github.io/audio/drum-samples/909/ride.mp3", color: "#E0C0FF", key: "r" },
      { id: "lowtom", name: "Low Tom", soundUrl: "https://tonejs.github.io/audio/drum-samples/909/tom-low.mp3", color: "#00CCCC", key: "a" },
      { id: "midtom", name: "Mid Tom", soundUrl: "https://tonejs.github.io/audio/drum-samples/909/tom-mid.mp3", color: "#40E0E0", key: "s" },
      { id: "hitom", name: "Hi Tom", soundUrl: "https://tonejs.github.io/audio/drum-samples/909/tom-hi.mp3", color: "#80F0F0", key: "d" },
      { id: "shaker", name: "Shaker", soundUrl: "https://tonejs.github.io/audio/drum-samples/808/808-tamb.mp3", color: "#C0FFFF", key: "f" },
    ]
  },
  acoustic: {
    id: "acoustic",
    name: "Acoustic",
    pads: [
      { id: "kick", name: "Kick", soundUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/kick.mp3", color: "#8C1BAB", key: "1" },
      { id: "snare", name: "Snare", soundUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/snare.mp3", color: "#AB1B86", key: "2" },
      { id: "rimshot", name: "Rim Shot", soundUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/snare-rim.mp3", color: "#D71B71", key: "3" },
      { id: "sidestick", name: "Side Stick", soundUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/snare-sidestick.mp3", color: "#E01B5C", key: "4" },
      { id: "hihat", name: "Closed Hat", soundUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/hihat-closed.mp3", color: "#EC8B5E", key: "q" },
      { id: "openhat", name: "Open Hat", soundUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/hihat-open.mp3", color: "#FFBC5E", key: "w" },
      { id: "crash", name: "Crash", soundUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/crash.mp3", color: "#FFDF5E", key: "e" },
      { id: "ride", name: "Ride", soundUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/ride.mp3", color: "#EDEF85", key: "r" },
      { id: "floortom", name: "Floor Tom", soundUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/tom-low.mp3", color: "#9EFF5E", key: "a" },
      { id: "midtom", name: "Mid Tom", soundUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/tom-mid.mp3", color: "#5EFF7F", key: "s" },
      { id: "hightom", name: "High Tom", soundUrl: "https://tonejs.github.io/audio/drum-samples/acoustic-kit/tom-hi.mp3", color: "#5EFFAB", key: "d" },
      { id: "cowbell", name: "Cowbell", soundUrl: "https://tonejs.github.io/audio/berklee/gong_1.mp3", color: "#5EFFD6", key: "f" },
    ]
  }
};

export default drumKits;

// Helper function to get available kits
export const getAvailableKits = () => {
  return Object.values(drumKits).map(kit => ({ id: kit.id, name: kit.name }));
};

// Helper function to get a specific kit
export const getKit = (kitId: DrumKitType) => {
  return drumKits[kitId];
};
