
import React, { useState, useEffect } from 'react';
import { useStudio } from '@/contexts/StudioHooks';
import { Cpu, Disc, Clock, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const StudioStatusBar = () => {
  const { isRecording, bpm, masterVolume } = useStudio();
  const [cpuUsage, setCpuUsage] = useState(10);
  const [currentTime, setCurrentTime] = useState("00:00:00");
  
  // Simulate CPU usage changes for demo purposes
  useEffect(() => {
    const timer = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 15) + 5);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time display
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Animated waveform bars for recording indicator
  const WaveformBars = () => (
    <div className="flex items-center h-4 space-x-0.5 ml-2">
      {[...Array(7)].map((_, i) => (
        <div 
          key={i}
          className="waveform-bar bg-white w-0.5 h-full rounded-full"
        />
      ))}
    </div>
  );

  return (
    <div className="h-6 bg-gradient-to-r from-cyber-red to-cyber-purple px-3 flex items-center text-xs shadow-lg">
      <div className="flex-1">
        {isRecording ? (
          <span className="text-white font-medium flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse mr-1"></span> 
            Recording <WaveformBars />
          </span>
        ) : (
          <span className="text-white flex items-center">
            <span className={cn(
              "inline-block h-1.5 w-1.5 rounded-full mr-1",
              "bg-green-400 shadow-[0_0_4px_rgba(74,222,128,0.6)]"
            )}></span>
            Ready
          </span>
        )}
      </div>
      <div className="flex space-x-4 text-white">
        <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-black/20">
          <Disc className="h-3 w-3" />
          <span>48000 Hz, Stereo</span>
        </div>
        <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-black/20">
          <Clock className="h-3 w-3" />
          <span>{currentTime}</span>
        </div>
        <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-black/20">
          <span className="font-medium">{bpm}</span>
          <span>BPM</span>
        </div>
        <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-black/20">
          <span>4/4</span>
        </div>
        <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-black/20">
          <Volume2 className="h-3 w-3" />
          <span>{masterVolume}%</span>
        </div>
        <div className={cn(
          "flex items-center space-x-1 px-1.5 py-0.5 rounded", 
          cpuUsage > 20 ? "bg-cyber-red/40" : "bg-black/20"
        )}>
          <Cpu className="h-3 w-3" />
          <span>CPU: {cpuUsage}%</span>
        </div>
      </div>
    </div>
  );
};

export default StudioStatusBar;
