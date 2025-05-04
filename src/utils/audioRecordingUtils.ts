
import * as Tone from 'tone';

// Initialize audio recording components
export const setupAudioRecording = async () => {
  try {
    // Initialize Tone context if needed
    await Tone.start();
    
    // Create microphone source
    const mic = new Tone.UserMedia();
    await mic.open();
    
    // Create meter for level monitoring
    const meter = new Tone.Meter();
    
    // Create analyzer for waveform
    const analyser = new Tone.Analyser("waveform", 256);
    
    // Create recorder
    const recorder = new Tone.Recorder();
    
    // Create gain node for input level control
    const gain = new Tone.Gain(0.75).toDestination();
    
    // Connect the audio chain
    mic.connect(gain);
    mic.connect(meter);
    mic.connect(analyser);
    mic.connect(recorder);
    
    return {
      mic,
      meter,
      analyser, 
      recorder,
      gain
    };
  } catch (error) {
    console.error("Failed to set up audio recording:", error);
    throw error;
  }
};

// Calculate audio level from meter
export const calculateAudioLevel = (meterValue: number): number => {
  // Convert dB to a 0-100 scale (approximately)
  return Math.max(0, Math.min(100, (meterValue + 85) * 1.5));
};

// Format time in seconds to mm:ss
export const formatRecordingTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Clean up audio resources
export const disposeAudioResources = (resources: {
  mic?: Tone.UserMedia,
  meter?: Tone.Meter,
  analyser?: Tone.Analyser,
  recorder?: Tone.Recorder,
  gain?: Tone.Gain
}) => {
  if (resources.mic) resources.mic.close();
  if (resources.meter) resources.meter.dispose();
  if (resources.analyser) resources.analyser.dispose();
  if (resources.recorder) resources.recorder.dispose();
  if (resources.gain) resources.gain.dispose();
};
