
import React, { useState, useEffect } from "react";
import { usePatternRecorderContext } from "@/contexts/PatternRecorderContext";
import { useSynth } from "@/hooks/useSynth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Mic, Square, Save, PlayCircle, Trash2, 
  CheckCircle, XCircle, EditIcon, Volume2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as Tone from "tone";

const MelodicPatternRecorder = () => {
  const {
    isRecording,
    currentPattern,
    savedPatterns,
    startRecording,
    stopRecording,
    playPattern,
    deletePattern,
    renamePattern
  } = usePatternRecorderContext();

  const { synth, initialized, setVolume } = useSynth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [synthVolume, setSynthVolume] = useState(-10);
  
  useEffect(() => {
    if (initialized && synth) {
      // Set initial volume
      setVolume(synthVolume);
    }
  }, [initialized, synth, setVolume, synthVolume]);

  const handleStartRecording = () => {
    startRecording("melodic");
  };

  const handlePlayPattern = (pattern: any) => {
    if (!synth) return;
    playPattern(pattern, synth);
  };

  const handleRenameStart = (pattern: any) => {
    setEditingId(pattern.id);
    setNewName(pattern.name);
  };

  const handleRenameSave = (id: string) => {
    renamePattern(id, newName);
    setEditingId(null);
  };

  const handleRenameCancel = () => {
    setEditingId(null);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setSynthVolume(newVolume);
    setVolume(newVolume);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Pattern Recorder</h3>
        
        <div className="flex items-center space-x-2">
          <Volume2 size={16} className="text-gray-400" />
          <input
            type="range"
            min="-40"
            max="0"
            value={synthVolume}
            onChange={handleVolumeChange}
            className="w-20"
          />
        </div>
      </div>

      <div className="space-y-2">
        {isRecording ? (
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={stopRecording}
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Recording
          </Button>
        ) : (
          <Button 
            variant="default" 
            className="w-full bg-cyber-red hover:bg-cyber-red/80"
            onClick={handleStartRecording}
          >
            <Mic className="h-4 w-4 mr-2" />
            Record Melody
          </Button>
        )}

        {isRecording && (
          <div className="bg-cyber-purple/10 p-2 rounded-md flex items-center justify-between">
            <span className="text-xs">Recording...</span>
            <span className="text-xs bg-cyber-purple/20 px-2 py-1 rounded">
              {Math.floor(Tone.Transport.seconds)} sec
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-medium text-gray-400">Saved Patterns</h4>
        
        {savedPatterns.length === 0 ? (
          <div className="text-xs text-gray-500 py-2 px-1">
            No patterns recorded yet. Use the Record button to create a pattern.
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {savedPatterns.map(pattern => (
              <div 
                key={pattern.id}
                className={cn(
                  "bg-cyber-darker p-2 rounded border",
                  currentPattern?.id === pattern.id 
                    ? "border-cyber-purple" 
                    : "border-gray-700"
                )}
              >
                {editingId === pattern.id ? (
                  <div className="flex items-center space-x-1">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="h-7 text-xs flex-1"
                      autoFocus
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => handleRenameSave(pattern.id)}
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={handleRenameCancel}
                    >
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-medium">{pattern.name}</span>
                      <span className="text-[10px] text-gray-400">
                        ({pattern.notes.length} notes, {pattern.duration.toFixed(1)}s)
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-cyber-blue"
                        onClick={() => handlePlayPattern(pattern)}
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-gray-400"
                        onClick={() => handleRenameStart(pattern)}
                      >
                        <EditIcon className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-red-400"
                        onClick={() => deletePattern(pattern.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="mt-1 bg-black/30 h-8 rounded relative overflow-hidden flex items-center justify-center">
                  <div className="flex items-end h-6 space-x-px">
                    {pattern.notes.map((note, i) => (
                      <div 
                        key={i}
                        className="w-1 bg-cyber-purple"
                        style={{ 
                          height: `${Math.min(100, (note.note % 12) * 8 + 20)}%`,
                          opacity: note.velocity / 127
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MelodicPatternRecorder;
