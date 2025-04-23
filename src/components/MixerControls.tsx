
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [volume, setVolume] = useState(80);
  const [showFaders, setShowFaders] = useState(true);
  
  const trackFaders = [
    { id: '1', name: 'Drum Bus', color: '#F9636F', value: 75 },
    { id: '2', name: 'Crash', color: '#F9636F', value: 68 },
    { id: '3', name: 'Thumper', color: '#F9636F', value: 72 },
    { id: '4', name: 'Drums', color: '#F9636F', value: 70 },
    { id: '5', name: 'Bass Bus', color: '#8B5CF6', value: 78 },
    { id: '6', name: 'Perc Bus', color: '#3C71D0', value: 65 },
    { id: '7', name: 'Key Bus', color: '#0CFCFC', value: 72 },
    { id: '8', name: 'Horns', color: '#ED213A', value: 68 },
  ];
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  return (
    <div className="relative">
      {showFaders && (
        <div className="h-[400px] bg-cyber-dark flex rounded-md overflow-hidden">
          {trackFaders.map((track, index) => (
            <div 
              key={track.id}
              className="flex flex-col items-center px-1 border-r border-cyber-purple/10 relative"
              style={{ width: '100px' }}
            >
              <div className="h-[300px] flex items-center justify-center my-2">
                <div className="w-8 h-full flex flex-col justify-end items-center bg-cyber-darker/40 relative rounded-sm overflow-hidden">
                  {/* Fader track background */}
                  <div 
                    className="w-full" 
                    style={{ 
                      height: `${track.value}%`,
                      background: `linear-gradient(to top, ${track.color}20, ${track.color}80)`
                    }}
                  ></div>
                  
                  {/* Fader handle */}
                  <div 
                    className="absolute w-8 h-4 bg-cyber-darker border border-white/20 rounded-sm left-0"
                    style={{ bottom: `calc(${track.value}% - 8px)` }}
                  >
                    <div className="h-2 mx-auto w-4 bg-white/10 rounded-sm"></div>
                  </div>
                  
                  {/* Level markings */}
                  <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                    {[0, 20, 40, 60, 80, 100].map((level) => (
                      <div 
                        key={level} 
                        className="w-2 h-px bg-white/20" 
                        style={{ marginLeft: level % 40 === 0 ? '4px' : '2px' }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="py-2 flex flex-col items-center">
                <div className="h-4 w-6 bg-cyber-darker rounded-sm"></div>
                <div className="mt-1 h-6 w-6 rounded-sm bg-cyber-darker flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: track.color }}></div>
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
            <div className="h-[300px] flex items-center justify-center my-2">
              <div className="w-10 h-full flex flex-col justify-end items-center bg-cyber-darker/40 relative rounded-sm overflow-hidden">
                {/* Fader track background */}
                <div 
                  className="w-full" 
                  style={{ 
                    height: `${volume}%`,
                    background: `linear-gradient(to top, #ED213A20, #ED213A)`
                  }}
                ></div>
                
                {/* Fader handle */}
                <div 
                  className="absolute w-10 h-5 bg-cyber-darker border border-white/30 rounded-sm left-0"
                  style={{ bottom: `calc(${volume}% - 10px)` }}
                >
                  <div className="h-3 mx-auto w-6 bg-white/20 rounded-sm"></div>
                </div>
              </div>
            </div>
            
            <div className="py-2 flex flex-col items-center">
              <div className="mt-1 h-8 w-8 rounded-sm bg-cyber-darker flex items-center justify-center">
                <Volume2 className="h-5 w-5 text-white" />
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium">Master</p>
                <p className="text-[10px] text-cyber-purple/70">{volume}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MixerControls;
