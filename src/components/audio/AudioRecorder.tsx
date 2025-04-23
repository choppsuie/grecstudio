
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, Square, Play, Download, Loader2 } from "lucide-react";
import * as Tone from "tone";

interface AudioRecorderProps {
  projectId?: string;
  trackId?: string;
  onRecordingComplete?: (blob: Blob, duration: number) => void;
}

const AudioRecorder = ({ projectId, trackId, onRecordingComplete }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const recorderRef = useRef<Tone.Recorder | null>(null);
  const microphoneRef = useRef<Tone.UserMedia | null>(null);
  const meterRef = useRef<Tone.Meter | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  const prepareRecording = async () => {
    setIsPreparing(true);
    
    try {
      // Initialize Tone.js
      await Tone.start();
      console.log("Tone.js started");
      
      // Set up the microphone input
      const mic = new Tone.UserMedia();
      await mic.open();
      console.log("Microphone opened");
      
      // Set up a meter to visualize the audio level
      const meter = new Tone.Meter();
      mic.connect(meter);
      
      // Set up the recorder
      const recorder = new Tone.Recorder();
      mic.connect(recorder);
      
      // Store references
      microphoneRef.current = mic;
      recorderRef.current = recorder;
      meterRef.current = meter;
      
      // Start visualizing audio levels
      visualizeMeter();
      
      setIsPreparing(false);
      
      toast({
        title: "Microphone Ready",
        description: "Click Record to start capturing audio.",
      });
    } catch (error) {
      console.error("Error preparing recording:", error);
      setIsPreparing(false);
      
      toast({
        title: "Microphone Access Error",
        description: "Please allow microphone access to record audio.",
        variant: "destructive",
      });
    }
  };
  
  const startRecording = async () => {
    if (!recorderRef.current || !microphoneRef.current) {
      await prepareRecording();
      return;
    }
    
    try {
      // Start the recorder
      recorderRef.current.start();
      startTimeRef.current = Date.now();
      
      setIsRecording(true);
      setAudioBlob(null);
      
      toast({
        title: "Recording Started",
        description: "Your audio is now being recorded.",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      
      toast({
        title: "Recording Error",
        description: "There was a problem starting the recording.",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = async () => {
    if (!recorderRef.current || !isRecording) return;
    
    try {
      // Calculate duration
      const duration = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;
      setAudioDuration(duration);
      
      // Stop the recorder and get the recording
      const recording = await recorderRef.current.stop();
      const blob = new Blob([recording], { type: "audio/wav" });
      
      setAudioBlob(blob);
      setIsRecording(false);
      
      // Call the callback if provided
      onRecordingComplete?.(blob, duration);
      
      // Create an audio element to preview the recording
      const audioUrl = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
      }
      
      toast({
        title: "Recording Complete",
        description: `Recorded ${duration.toFixed(1)} seconds of audio.`,
      });
    } catch (error) {
      console.error("Error stopping recording:", error);
      
      toast({
        title: "Recording Error",
        description: "There was a problem stopping the recording.",
        variant: "destructive",
      });
      
      setIsRecording(false);
    }
  };
  
  const playRecording = () => {
    if (audioRef.current && audioBlob) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  
  const downloadRecording = () => {
    if (!audioBlob) return;
    
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `recording-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };
  
  const visualizeMeter = () => {
    if (!meterRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const drawMeter = () => {
      if (!meterRef.current || !ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      // Get the level from the meter (-100 to 0 dB)
      const level = meterRef.current.getValue();
      
      // Convert to a value between 0 and 1
      // -100 dB is silence, 0 dB is max volume
      const normalizedLevel = Math.max(0, 1 + level / 100);
      const barHeight = canvas.offsetHeight * normalizedLevel;
      
      // Draw the level meter
      const gradient = ctx.createLinearGradient(0, canvas.offsetHeight - barHeight, 0, canvas.offsetHeight);
      
      if (isRecording) {
        gradient.addColorStop(0, "#FF0080");
        gradient.addColorStop(1, "#7928CA");
      } else {
        gradient.addColorStop(0, "#8B5CF6");
        gradient.addColorStop(1, "#4F46E5");
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.offsetHeight - barHeight, canvas.offsetWidth, barHeight);
      
      // Request next frame
      animationFrameRef.current = requestAnimationFrame(drawMeter);
    };
    
    drawMeter();
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (microphoneRef.current) {
        microphoneRef.current.close();
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Set up audio element listeners
  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (audioElement) {
      const handleEnded = () => {
        setIsPlaying(false);
      };
      
      audioElement.addEventListener("ended", handleEnded);
      
      return () => {
        audioElement.removeEventListener("ended", handleEnded);
      };
    }
  }, [audioRef.current]);
  
  return (
    <div className="p-4 bg-cyber-darker border border-cyber-purple/20 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Audio Recorder</h3>
      
      <div className="space-y-4">
        <div className="h-16 bg-cyber-dark/60 rounded-lg overflow-hidden">
          <canvas 
            ref={canvasRef}
            className="w-full h-full"
            onClick={isPreparing ? undefined : prepareRecording}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isPreparing ? (
              <Button disabled className="bg-cyber-purple hover:bg-cyber-purple/80">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Preparing...</span>
              </Button>
            ) : isRecording ? (
              <Button 
                onClick={stopRecording}
                variant="outline"
                className="border-red-500/50 text-red-300 hover:bg-red-500/20"
              >
                <Square className="h-4 w-4 mr-2" />
                <span>Stop</span>
              </Button>
            ) : microphoneRef.current ? (
              <Button 
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600"
              >
                <Mic className="h-4 w-4 mr-2" />
                <span>Record</span>
              </Button>
            ) : (
              <Button 
                onClick={prepareRecording}
                className="bg-cyber-purple hover:bg-cyber-purple/80"
              >
                <Mic className="h-4 w-4 mr-2" />
                <span>Setup Microphone</span>
              </Button>
            )}
          </div>
          
          {audioBlob && (
            <div className="flex items-center space-x-2">
              <Button 
                onClick={playRecording}
                variant="outline"
                disabled={isPlaying}
                className="border-cyber-blue/50 text-cyber-blue hover:bg-cyber-blue/20"
              >
                <Play className="h-4 w-4 mr-2" />
                <span>Play</span>
              </Button>
              
              <Button 
                onClick={downloadRecording}
                variant="outline"
                className="border-cyber-purple/50 text-cyber-purple hover:bg-cyber-purple/20"
              >
                <Download className="h-4 w-4 mr-2" />
                <span>Download</span>
              </Button>
            </div>
          )}
        </div>
        
        {audioDuration > 0 && (
          <div className="text-center text-sm text-white/60">
            <p>Recording duration: {audioDuration.toFixed(1)} seconds</p>
          </div>
        )}
        
        <audio ref={audioRef} className="hidden" />
      </div>
    </div>
  );
};

export default AudioRecorder;
