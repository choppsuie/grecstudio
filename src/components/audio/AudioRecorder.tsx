
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import {
  setupAudioRecording,
  calculateAudioLevel,
  formatRecordingTime,
  disposeAudioResources
} from "@/utils/audioRecordingUtils";

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
  
  // Refs for audio components
  const audioResources = useRef<{
    mic?: Tone.UserMedia;
    meter?: Tone.Meter;
    analyser?: Tone.Analyser;
    recorder?: Tone.Recorder;
    gain?: Tone.Gain;
  }>({});
  
  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timerRef.current) window.clearInterval(timerRef.current);
      disposeAudioResources(audioResources.current);
    };
  }, []);
  
  const startLevelMonitoring = () => {
    if (audioResources.current.meter) {
      intervalRef.current = window.setInterval(() => {
        const level = audioResources.current.meter?.getValue() as number;
        setAudioLevel(calculateAudioLevel(level));
      }, 100);
    }
  };
  
  const startRecording = async () => {
    try {
      const resources = await setupAudioRecording();
      audioResources.current = resources;
      
      // Apply current gain setting
      if (resources.gain) {
        resources.gain.gain.value = inputGain / 100;
      }
      
      setIsRecording(true);
      setRecordingTime(0);
      
      if (resources.recorder) {
        resources.recorder.start();
        
        // Start level monitoring
        startLevelMonitoring();
        
        // Start recording timer
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
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast({
        title: "Microphone Access Error",
        description: "Please ensure you've granted microphone permissions.",
        variant: "destructive"
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
    try {
      if (audioResources.current.recorder) {
        const recording = await audioResources.current.recorder.stop();
        const duration = recordingTime;
        
        // Notify about completion
        if (onRecordingComplete) {
          onRecordingComplete(recording, duration);
        }
        
        toast({
          title: "Recording Complete",
          description: `Recorded ${formatRecordingTime(recordingTime)} of audio`
        });
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      toast({
        title: "Recording Error",
        description: "Failed to save the recording.",
        variant: "destructive"
      });
    } finally {
      // Cleanup audio resources
      disposeAudioResources(audioResources.current);
      audioResources.current = {};
      
      setIsRecording(false);
      setAudioLevel(0);
    }
  };
  
  const handleGainChange = (value: number[]) => {
    const newGain = value[0];
    setInputGain(newGain);
    
    // Update the gain node if recording is in progress
    if (audioResources.current.gain) {
      audioResources.current.gain.gain.value = newGain / 100;
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
          {isRecording ? formatRecordingTime(recordingTime) : "0:00"}
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
