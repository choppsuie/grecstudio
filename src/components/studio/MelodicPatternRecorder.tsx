
import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { 
  Record, Square, Save, PlayCircle, Trash2, 
  CheckCircle, XCircle, EditIcon, Volume2 
} from "lucide-react";
import { usePatternRecorder } from "@/hooks/usePatternRecorder";
import { useSynth } from "@/hooks/useSynth";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const MelodicPatternRecorder = () => {
  const { 
    isRecording, currentPattern, savedPatterns,
    startRecording, stopRecording, playPattern,
    deletePattern, renamePattern 
  } = usePatternRecorder();
  
  const [volume, setVolume] = useState(75);
  const { currentSynth, synth, changeSynthType } = useSynth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const { toast } = useToast();
  
  const patternPlayerRef = useRef<Tone.Player | null>(null);

  // Initialize Tone.js
  useEffect(() => {
    const initAudio = async () => {
      if (Tone.context.state !== "running") {
        await Tone.start();
      }
    };
    
    initAudio();
  }, []);

  // Handle volume changes
  useEffect(() => {
    const volumeDb = ((volume / 100) * 40) - 40; // Convert 0-100 to -40dB to 0dB
    if (synth) {
      synth.volume.value = volumeDb;
    }
  }, [volume, synth]);

  const handleStartRecording = async () => {
    if (isRecording) return;
    
    try {
      // Make sure audio is initialized
      await Tone.start();
      startRecording(currentSynth);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not start recording. Try clicking the screen first.",
        variant: "destructive"
      });
    }
  };

  const handleStopRecording = () => {
    if (!isRecording) return;
    stopRecording();
  };

  const handlePlayPattern = async (pattern: typeof currentPattern) => {
    if (!pattern || isPlaying || !synth) return;
    
    try {
      await Tone.start();
      setIsPlaying(true);
      
      // Play the pattern
      playPattern(pattern, synth);
      
      // Set a timeout to reset the playing state
      setTimeout(() => {
        setIsPlaying(false);
      }, pattern.duration * 1000 + 500); // Add a small buffer
    } catch (error) {
      toast({
        title: "Playback Error",
        description: "Failed to play the pattern",
        variant: "destructive"
      });
      setIsPlaying(false);
    }
  };

  const handleDelete = (patternId: string) => {
    deletePattern(patternId);
  };

  const startEditing = (pattern: typeof currentPattern) => {
    if (!pattern) return;
    setEditingId(pattern.id);
    setEditName(pattern.name);
  };

  const saveEditing = () => {
    if (!editingId) return;
    renamePattern(editingId, editName);
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  return (
    <div className="p-3 bg-cyber-dark rounded-md border border-cyber-purple/40">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-cyber-purple">Melody Recorder</h3>
        <div className="flex items-center space-x-2">
          <Volume2 className="text-cyber-purple w-4 h-4" />
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            className="w-24"
            onValueChange={(values) => setVolume(values[0])}
          />
        </div>
      </div>

      <div className="mb-4">
        <div className={cn(
          "p-3 rounded-md transition-all",
          isRecording ? "bg-red-500/20 border border-red-500/50 animate-pulse" : "bg-cyber-darker/50"
        )}>
          <div className="flex justify-between items-center">
            <div>
              {isRecording ? (
                <div className="text-sm flex items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-ping"></span>
                  Recording...
                </div>
              ) : (
                <div className="text-sm text-cyber-purple/70">
                  Ready to record
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              {!isRecording ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-cyber-red text-cyber-red hover:bg-cyber-red/10"
                  onClick={handleStartRecording}
                >
                  <Record className="h-4 w-4 mr-1" />
                  Record
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/50 hover:bg-white/10"
                  onClick={handleStopRecording}
                >
                  <Square className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              )}
            </div>
          </div>
          
          {currentPattern && !isRecording && (
            <div className="mt-3 bg-cyber-darker p-2 rounded border border-cyber-purple/10">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">{currentPattern.name}</div>
                <div className="text-xs text-cyber-purple/60">
                  {currentPattern.notes.length} notes · {currentPattern.duration.toFixed(2)}s
                </div>
              </div>
              
              <div className="mt-2 flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => handlePlayPattern(currentPattern)}
                  disabled={isPlaying}
                >
                  <PlayCircle className="h-3 w-3 mr-1" />
                  Play
                </Button>
                <Button 
                  variant="outline"  
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => startEditing(currentPattern)}
                >
                  <EditIcon className="h-3 w-3 mr-1" />
                  Rename
                </Button>
              </div>
              
              <div className="mt-3 h-12 bg-cyber-dark/50 rounded overflow-hidden">
                {currentPattern.notes.length > 0 ? (
                  <div className="relative h-full">
                    {currentPattern.notes.map((note, index) => {
                      const notePosition = (note.time / currentPattern.duration) * 100;
                      const noteWidth = Math.max(1, (note.duration / currentPattern.duration) * 100);
                      const noteHeight = 100 - ((note.note % 24) * 4);
                      
                      return (
                        <div
                          key={index}
                          className="absolute bg-cyber-purple/70 rounded-sm"
                          style={{
                            left: `${notePosition}%`,
                            bottom: `${noteHeight}%`,
                            width: `${noteWidth}%`,
                            height: '6%',
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-cyber-purple/40">
                    No notes recorded
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {savedPatterns.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-cyber-purple/80 mb-2">Saved Patterns</h4>
          <div className="space-y-2">
            {savedPatterns.map((pattern) => (
              <div 
                key={pattern.id}
                className="bg-cyber-darker p-2 rounded border border-cyber-purple/10"
              >
                {editingId === pattern.id ? (
                  <div className="flex items-center space-x-2">
                    <Input 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-7 text-sm flex-1"
                      autoFocus
                    />
                    <Button variant="ghost" size="sm" onClick={saveEditing} className="h-7 w-7 p-0">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={cancelEditing} className="h-7 w-7 p-0">
                      <XCircle className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">{pattern.name}</div>
                      <div className="text-xs text-cyber-purple/60">
                        {pattern.notes.length} notes · {pattern.duration.toFixed(2)}s
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8"
                        onClick={() => handlePlayPattern(pattern)}
                        disabled={isPlaying}
                      >
                        <PlayCircle className={cn(
                          "h-4 w-4", 
                          isPlaying ? "text-cyber-purple" : "text-cyber-purple/70"
                        )} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8"
                        onClick={() => startEditing(pattern)}
                      >
                        <EditIcon className="h-4 w-4 text-cyber-purple/70" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8"
                        onClick={() => handleDelete(pattern.id)}
                      >
                        <Trash2 className="h-4 w-4 text-cyber-purple/70" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MelodicPatternRecorder;
