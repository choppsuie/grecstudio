
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Scissors, ChevronsLeftRight, Copy, Trash2, Maximize2, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStudio } from "@/contexts/StudioHooks";
import { useClipInteraction } from "@/hooks/useClipInteraction";

interface ClipEditorProps {
  clipId: string;
  audioBuffer?: AudioBuffer;
  onClose: () => void;
  onApply: (clipId: string, operations: any) => void;
}

const ClipEditor: React.FC<ClipEditorProps> = ({
  clipId,
  audioBuffer,
  onClose,
  onApply,
}) => {
  const { toneInitialized } = useStudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selection, setSelection] = useState<{start: number, end: number} | null>(null);
  const [zoom, setZoom] = useState(100);
  const [volume, setVolume] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [modified, setModified] = useState(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [operations, setOperations] = useState<any[]>([]);
  
  // Initialize canvas and draw waveform
  useEffect(() => {
    if (!canvasRef.current || !audioBuffer) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#1A1F2C';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Get audio data for waveform visualization
    const channelData = audioBuffer.getChannelData(0);
    const step = Math.ceil(channelData.length / canvas.width);
    const zoomFactor = zoom / 100;
    
    // Draw waveform
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#8B5CF6';
    
    const midHeight = canvas.height / 2;
    
    // Visible portion calculation based on scroll and zoom
    const visibleSamples = channelData.length / zoomFactor;
    const startSample = Math.floor(scrollPosition * channelData.length);
    
    for (let i = 0; i < canvas.width; i++) {
      const sampleIndex = startSample + Math.floor(i * (visibleSamples / canvas.width));
      if (sampleIndex >= channelData.length) break;
      
      // Get max amplitude for this chunk
      let max = 0;
      for (let j = 0; j < step && (sampleIndex + j) < channelData.length; j++) {
        const value = Math.abs(channelData[sampleIndex + j]);
        if (value > max) max = value;
      }
      
      const height = max * midHeight * 0.9;
      
      ctx.moveTo(i, midHeight - height);
      ctx.lineTo(i, midHeight + height);
    }
    
    ctx.stroke();
    
    // Draw selection if exists
    if (selection) {
      const startX = Math.floor((selection.start - scrollPosition) * canvas.width / zoomFactor);
      const endX = Math.floor((selection.end - scrollPosition) * canvas.width / zoomFactor);
      
      ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
      ctx.fillRect(startX, 0, endX - startX, canvas.height);
      
      // Draw selection edges
      ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
      ctx.fillRect(startX, 0, 2, canvas.height);
      ctx.fillRect(endX, 0, 2, canvas.height);
    }
    
  }, [audioBuffer, zoom, selection, scrollPosition]);
  
  // Handle canvas mouse interactions for selection
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const normalizedX = x / rect.width;
    
    const zoomFactor = zoom / 100;
    const actualPosition = scrollPosition + (normalizedX / zoomFactor);
    
    setSelection({
      start: actualPosition,
      end: actualPosition
    });
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current || !selection) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const normalizedX = Math.max(0, Math.min(1, x / rect.width));
      
      const actualPosition = scrollPosition + (normalizedX / zoomFactor);
      
      setSelection(prev => ({
        ...prev!,
        end: actualPosition
      }));
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Normalize selection (ensure start < end)
      if (selection) {
        const normalizedSelection = {
          start: Math.min(selection.start, selection.end),
          end: Math.max(selection.start, selection.end)
        };
        setSelection(normalizedSelection);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Play selected audio or full clip
  const playAudio = () => {
    if (!audioBuffer || !toneInitialized) return;
    
    // Stop any playing audio
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    
    // Apply gain
    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = Math.pow(10, volume / 20); // Convert dB to linear
    source.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    // Apply detune/pitch if needed
    source.detune.value = pitch * 100; // Convert semitones to cents
    
    // Play selection or entire clip
    if (selection && selection.start !== selection.end) {
      const startSec = selection.start * audioBuffer.duration;
      const endSec = selection.end * audioBuffer.duration;
      source.start(0, startSec, endSec - startSec);
    } else {
      source.start();
    }
    
    audioSourceRef.current = source;
    setPlaying(true);
    
    source.onended = () => {
      setPlaying(false);
    };
  };
  
  // Stop playback
  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    setPlaying(false);
  };
  
  // Handle clip edit operations
  const handleCut = () => {
    if (!selection || selection.start === selection.end) return;
    
    setOperations([...operations, {
      type: 'cut',
      range: {...selection}
    }]);
    
    setModified(true);
    setSelection(null);
  };
  
  const handleCopy = () => {
    if (!selection || selection.start === selection.end) return;
    
    setOperations([...operations, {
      type: 'copy',
      range: {...selection}
    }]);
    
    setModified(true);
  };
  
  const handleDelete = () => {
    if (!selection || selection.start === selection.end) return;
    
    setOperations([...operations, {
      type: 'delete',
      range: {...selection}
    }]);
    
    setModified(true);
    setSelection(null);
  };
  
  const handleSplit = () => {
    if (!selection) return;
    
    setOperations([...operations, {
      type: 'split',
      position: selection.start
    }]);
    
    setModified(true);
    setSelection(null);
  };
  
  const handleNormalize = () => {
    setOperations([...operations, {
      type: 'normalize',
      value: 0  // 0dB
    }]);
    
    setModified(true);
  };
  
  const handleApplyChanges = () => {
    onApply(clipId, {
      operations,
      volume,
      pitch
    });
    onClose();
  };
  
  const handleScroll = (e: React.WheelEvent<HTMLCanvasElement>) => {
    // Adjust scroll position based on wheel movement
    const zoomFactor = zoom / 100;
    const newScroll = scrollPosition + (e.deltaY * 0.001 * zoomFactor);
    setScrollPosition(Math.max(0, Math.min(1 - (1 / zoomFactor), newScroll)));
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-cyber-darker border border-cyber-purple/20 rounded-md w-5/6 h-5/6 flex flex-col overflow-hidden shadow-lg">
        <div className="p-3 border-b border-cyber-purple/20 flex justify-between items-center">
          <h3 className="text-lg font-medium text-cyber-purple">Clip Editor - {clipId}</h3>
          <Button variant="ghost" className="text-cyber-purple" onClick={onClose}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-[300px] bg-cyber-dark/40 rounded-md mb-4 overflow-hidden relative">
            <canvas
              ref={canvasRef}
              width="1000"
              height="300"
              className="w-full h-full cursor-crosshair"
              onMouseDown={handleCanvasMouseDown}
              onWheel={handleScroll}
            />
            
            {/* Time ruler */}
            <div className="absolute top-0 left-0 right-0 h-5 bg-cyber-dark/80 flex">
              {[...Array(11)].map((_, i) => (
                <div key={i} className="flex-1 flex items-center justify-center border-r border-cyber-purple/20">
                  <span className="text-[9px] text-cyber-purple/70">{i * 10}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-cyber-dark"
                    onClick={playing ? stopAudio : playAudio}
                  >
                    {playing ? "Stop" : "Play Selection"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-cyber-dark"
                    onClick={handleSplit}
                    disabled={!selection}
                  >
                    <Scissors className="h-3.5 w-3.5" />
                    <span>Split</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-cyber-dark"
                    onClick={handleCut}
                    disabled={!selection || selection.start === selection.end}
                  >
                    <ChevronsLeftRight className="h-3.5 w-3.5" />
                    <span>Cut</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-cyber-dark"
                    onClick={handleCopy}
                    disabled={!selection || selection.start === selection.end}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-cyber-dark"
                    onClick={handleDelete}
                    disabled={!selection || selection.start === selection.end}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-cyber-dark"
                    onClick={handleNormalize}
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                    <span>Normalize</span>
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm">Zoom:</div>
                  <Slider
                    value={[zoom]}
                    min={100}
                    max={1000}
                    step={10}
                    onValueChange={(values) => setZoom(values[0])}
                    className="w-48"
                  />
                  <div className="text-sm text-cyber-purple/70">{zoom}%</div>
                </div>
              </div>
            </div>
            
            <div className="col-span-4 space-y-4 border-l border-cyber-purple/20 pl-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm">Volume</label>
                  <span className="text-sm text-cyber-purple/70">{volume} dB</span>
                </div>
                <Slider
                  value={[volume]}
                  min={-24}
                  max={12}
                  step={0.1}
                  onValueChange={(values) => {
                    setVolume(values[0]);
                    setModified(true);
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm">Pitch</label>
                  <span className="text-sm text-cyber-purple/70">{pitch > 0 ? '+' : ''}{pitch} st</span>
                </div>
                <Slider
                  value={[pitch]}
                  min={-12}
                  max={12}
                  step={1}
                  onValueChange={(values) => {
                    setPitch(values[0]);
                    setModified(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-cyber-purple/20 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="default"
            className="bg-cyber-purple hover:bg-cyber-purple/90"
            onClick={handleApplyChanges}
            disabled={!modified}
          >
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClipEditor;
