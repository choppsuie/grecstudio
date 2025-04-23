
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import * as Tone from "tone";

interface AudioRecorderProps {
  projectId: string;
  onRecordingComplete?: (blob: Blob, duration: number) => void;
}

const AudioRecorder = ({ projectId, onRecordingComplete }: AudioRecorderProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [inputGain, setInputGain] = useState(75);
  const [showSettings, setShowSettings] = useState(false);
  
  const micRef = useRef<Tone.UserMedia | null>(null);
  const recorderRef = useRef<Tone.Recorder | null>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);
  const meterRef = useRef<Tone.Meter | null>(null);
  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // Initialize Tone.js components
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timerRef.current) window.clearInterval(timerRef.current);
      
      if (micRef.current) micRef.current.close();
      if (meterRef.current) meterRef.current.dispose();
      if (analyserRef.current) analyserRef.current.dispose();
      if (recorderRef.current) recorderRef.current.dispose();
    };
  }, []);
  
  const setupAudioChain = async () => {
    try {
      // Initialize Tone context if needed
      await Tone.start();
      
      // Create microphone source
      const mic = new Tone.UserMedia();
      await mic.open();
      micRef.current = mic;
      
      // Create gain node
      const gain = new Tone.Gain(inputGain / 100).toDestination();
      
      // Create meter for level monitoring
      const meter = new Tone.Meter();
      meterRef.current = meter;
      
      // Create analyzer for waveform
      const analyser = new Tone.Analyser("waveform", 256);
      analyserRef.current = analyser;
      
      // Create recorder
      const recorder = new Tone.Recorder();
      recorderRef.current = recorder;
      
      // Connect the audio chain
      mic.connect(gain);
      mic.connect(meter);
      mic.connect(analyser);
      mic.connect(recorder);
      
      // Start level monitoring
      startLevelMonitoring();
      
      return true;
    } catch (error) {
      console.error("Failed to set up audio recording:", error);
      toast({
        title: "Microphone Access Error",
        description: "Please ensure you've granted microphone permissions.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const startLevelMonitoring = () => {
    if (meterRef.current) {
      intervalRef.current = window.setInterval(() => {
        const level = meterRef.current?.getValue() as number;
        // Convert dB to a 0-100 scale (approximately)
        const normalizedLevel = Math.max(0, Math.min(100, (level + 85) * 1.5));
        setAudioLevel(normalizedLevel);
      }, 100);
    }
  };
  
  const startRecording = async () => {
    const setupSuccess = await setupAudioChain();
    
    if (!setupSuccess) return;
    
    setIsRecording(true);
    setRecordingTime(0);
    
    if (recorderRef.current) {
      recorderRef.current.start();
      
      // Start a timer to track recording duration
      const startTime = Date.now();
      timerRef.current = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setRecordingTime(elapsed);
      }, 1000);
      
      toast({
        title: "Recording Started",
        description: "Your audio is now being recorded"
      });
    }
  };
  
  const stopRecording = async () => {
    if (!isRecording) return;
    
    // Stop the timers
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Stop the recorder and get the audio data
    if (recorderRef.current) {
      const recording = await recorderRef.current.stop();
      
      // Format the recording as WAV
      const duration = recordingTime;
      
      // Notify about completion
      if (onRecordingComplete) {
        onRecordingComplete(recording, duration);
      }
      
      toast({
        title: "Recording Complete",
        description: `Recorded ${formatTime(recordingTime)} of audio`
      });
    }
    
    // Cleanup audio resources
    if (micRef.current) {
      micRef.current.close();
      micRef.current = null;
    }
    
    if (meterRef.current) {
      meterRef.current.dispose();
      meterRef.current = null;
    }
    
    if (analyserRef.current) {
      analyserRef.current.dispose();
      analyserRef.current = null;
    }
    
    if (recorderRef.current) {
      recorderRef.current.dispose();
      recorderRef.current = null;
    }
    
    setIsRecording(false);
    setAudioLevel(0);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleGainChange = (value: number[]) => {
    const newGain = value[0];
    setInputGain(newGain);
    
    // Update the gain node if recording is in progress
    if (micRef.current && isRecording) {
      const gainNode = new Tone.Gain(newGain / 100);
      micRef.current.connect(gainNode);
    }
  };
  
  return (
    <div className="glass-card p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Audio Recorder</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowSettings(!showSettings)}
          className="h-8 w-8"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      {showSettings && (
        <div className="space-y-2 mb-4 p-3 bg-cyber-darker/50 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-xs">Input Gain</span>
            <div className="w-32">
              <Slider
                value={[inputGain]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleGainChange}
              />
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-4">
        <div className="flex-1 h-8 bg-cyber-darker rounded-md overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyber-red to-cyber-purple transition-all duration-100"
            style={{ width: `${audioLevel}%` }}
          ></div>
        </div>
        
        <div className="text-sm font-mono">
          {isRecording ? formatTime(recordingTime) : "0:00"}
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="bg-cyber-red hover:bg-cyber-red/80"
          >
            <Mic className="h-4 w-4 mr-2" />
            Record
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="bg-cyber-darker hover:bg-cyber-darker/80 border border-cyber-red"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
