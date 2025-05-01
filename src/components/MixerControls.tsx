import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import * as Tone from "tone";

interface MixerControlsProps {
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  isPlaying?: boolean;
}

const MixerControls = ({
  onPlay,
  onPause,
  onStop,
  onSave,
  onShare,
  isPlaying = false
}: MixerControlsProps) => {
  const [masterVolume, setMasterVolume] = useState(80);
  const [showFaders, setShowFaders] = useState(true);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const faderRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const [trackFaders, setTrackFaders] = useState([
    { id: '1', name: 'Drum Bus', color: '#F9636F', value: 75 },
    { id: '2', name: 'Crash', color: '#F9636F', value: 68 },
    { id: '3', name: 'Thumper', color: '#F9636F', value: 72 },
    { id: '4', name: 'Drums', color: '#F9636F', value: 70 },
    { id: '5', name: 'Bass Bus', color: '#8B5CF6', value: 78 },
    { id: '6', name: 'Perc Bus', color: '#3C71D0', value: 65 },
    { id: '7', name: 'Key Bus', color: '#0CFCFC', value: 72 },
    { id: '8', name: 'Horns', color: '#ED213A', value: 68 },
  ]);
  
  // Handle master volume change and apply to Tone.js
  const handleMasterVolumeChange = (value: number[]) => {
    setMasterVolume(value[0]);
    const dbValue = ((value[0] / 100) * 40) - 40; // Convert to dB scale
    if (Tone.getDestination()) {
      Tone.getDestination().volume.value = dbValue;
    }
  };

  // Handle track fader changes
  const handleTrackFaderChange = (trackId: string, newValue: number) => {
    setTrackFaders(prev => 
      prev.map(track => 
        track.id === trackId 
          ? { ...track, value: Math.max(0, Math.min(100, newValue)) } 
          : track
      )
    );
  };
  
  // Mouse/touch drag handlers for faders
  const handleFaderMouseDown = (trackId: string) => {
    setIsDragging(trackId);
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const faderEl = faderRefs.current[isDragging];
      if (!faderEl) return;
      
      const faderRect = faderEl.getBoundingClientRect();
      const faderHeight = faderRect.height;
      
      // Calculate position relative to fader (0 = bottom, 1 = top)
      const relativePos = 1 - Math.max(0, Math.min(1, (e.clientY - faderRect.top) / faderHeight));
      const newValue = Math.round(relativePos * 100);
      
      // Apply value
      if (isDragging === 'master') {
        handleMasterVolumeChange([newValue]);
      } else {
        handleTrackFaderChange(isDragging, newValue);
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(null);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove as any);
      document.addEventListener('touchend', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove as any);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);
  
  const registerFaderRef = (id: string, el: HTMLDivElement | null) => {
    faderRefs.current[id] = el;
  };

  return (
    <div className="relative">
      {showFaders && (
        <div className="bg-cyber-dark flex rounded-md overflow-hidden border border-cyber-purple/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          {trackFaders.map((track) => (
            <div 
              key={track.id}
              className="flex flex-col items-center px-1 border-r border-cyber-purple/10 relative hover:bg-cyber-darker/30 transition-colors"
              style={{ width: '100px' }}
            >
              <div className="h-[260px] flex items-center justify-center my-2">
                <div 
                  className="w-8 h-full flex flex-col justify-end items-center bg-cyber-darker/40 relative rounded-sm overflow-hidden cursor-pointer"
                  ref={(el) => registerFaderRef(track.id, el)}
                  onMouseDown={() => handleFaderMouseDown(track.id)}
                  onTouchStart={() => handleFaderMouseDown(track.id)}
                >
                  {/* Fader track background */}
                  <div 
                    className="w-full" 
                    style={{ 
                      height: `${track.value}%`,
                      background: `linear-gradient(to top, ${track.color}20, ${track.color}80)`
                    }}
                  />
                  
                  {/* Fader handle */}
                  <div 
                    className={cn(
                      "absolute w-10 h-4 border rounded-sm left-0 transition-shadow",
                      isDragging === track.id ? "shadow-lg border-white/40 bg-cyber-darker" : "border-white/20 bg-cyber-darker"
                    )}
                    style={{ 
                      bottom: `calc(${track.value}% - 8px)`,
                      boxShadow: isDragging === track.id ? "0 0 15px rgba(139, 92, 246, 0.5)" : "",
                    }}
                  >
                    <div className="h-2 mx-auto w-6 bg-white/10 rounded-sm" />
                  </div>
                  
                  {/* Level markings */}
                  <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                    {[0, 20, 40, 60, 80, 100].map((level) => (
                      <div 
                        key={level} 
                        className="w-2 h-px bg-white/20" 
                        style={{ marginLeft: level % 40 === 0 ? '4px' : '2px' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="py-2 flex flex-col items-center">
                <div className="h-4 w-6 bg-cyber-darker rounded-sm shadow-inner" />
                <div className="mt-1 h-6 w-6 rounded-sm bg-cyber-darker flex items-center justify-center shadow-inner">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: track.color }} />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs whitespace-nowrap">{track.name}</p>
                  <p className="text-[10px] text-cyber-purple/70">{track.value}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Master fader */}
          <div 
            className="flex flex-col items-center px-2 border-r border-cyber-purple/10 relative bg-cyber-darker/30"
            style={{ width: '100px' }}
          >
            <div className="h-[260px] flex items-center justify-center my-2">
              <div 
                className="w-10 h-full flex flex-col justify-end items-center bg-cyber-darker/40 relative rounded-sm overflow-hidden cursor-pointer"
                ref={(el) => registerFaderRef('master', el)}
                onMouseDown={() => handleFaderMouseDown('master')}
                onTouchStart={() => handleFaderMouseDown('master')}
              >
                {/* Fader track background */}
                <div 
                  className="w-full" 
                  style={{ 
                    height: `${masterVolume}%`,
                    background: `linear-gradient(to top, #ED213A20, #ED213A)`
                  }}
                />
                
                {/* Fader handle */}
                <div 
                  className={cn(
                    "absolute w-12 h-5 border rounded-sm left-0 transition-shadow",
                    isDragging === 'master' ? "shadow-lg border-white/40 bg-cyber-darker" : "border-white/30 bg-cyber-darker"
                  )}
                  style={{ 
                    bottom: `calc(${masterVolume}% - 10px)`,
                    boxShadow: isDragging === 'master' ? "0 0 15px rgba(237, 33, 58, 0.5)" : "",
                  }}
                >
                  <div className="h-3 mx-auto w-8 bg-white/20 rounded-sm" />
                </div>
              </div>
            </div>
            
            <div className="py-2 flex flex-col items-center">
              <div className="mt-1 h-8 w-8 rounded-sm bg-cyber-darker flex items-center justify-center shadow-inner">
                <Volume2 className="h-5 w-5 text-white" />
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium">Master</p>
                <p className="text-[10px] text-cyber-purple/70">{masterVolume}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MixerControls;
