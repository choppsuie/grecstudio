
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Marker {
  id: string;
  name: string;
  time: string;
  color: string;
}

const MarkerList = () => {
  const [markers, setMarkers] = useState<Marker[]>([
    { id: '1', name: 'Intro', time: '00:00.000', color: '#9b87f5' },
    { id: '2', name: 'Verse 1', time: '00:08.000', color: '#F9636F' },
    { id: '3', name: 'Chorus', time: '00:16.000', color: '#3C71D0' },
    { id: '4', name: 'Verse 2', time: '00:24.000', color: '#F9636F' },
    { id: '5', name: 'Outro', time: '00:32.000', color: '#8E9196' },
  ]);
  
  const [newMarker, setNewMarker] = useState({
    name: '',
    time: '00:00.000'
  });
  
  const addMarker = () => {
    if (newMarker.name.trim()) {
      const marker: Marker = {
        id: Date.now().toString(),
        name: newMarker.name,
        time: newMarker.time,
        color: getRandomColor()
      };
      
      setMarkers([...markers, marker]);
      setNewMarker({ name: '', time: '00:00.000' });
    }
  };
  
  const removeMarker = (id: string) => {
    setMarkers(markers.filter(marker => marker.id !== id));
  };
  
  const getRandomColor = () => {
    const colors = ['#9b87f5', '#F9636F', '#3C71D0', '#0CFCFC', '#8E9196'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  return (
    <div className="space-y-2">
      <div className="glass-card p-3 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Project Markers</h3>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {markers.map((marker) => (
            <div 
              key={marker.id}
              className="flex items-center p-2 bg-cyber-dark/50 rounded-md"
            >
              <div 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: marker.color }}
              ></div>
              <div className="flex-1">
                <p className="text-sm">{marker.name}</p>
                <p className="text-xs text-cyber-purple/70">{marker.time}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-cyber-red/20"
                onClick={() => removeMarker(marker.id)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-3 flex space-x-2">
          <Input
            value={newMarker.name}
            onChange={(e) => setNewMarker({ ...newMarker, name: e.target.value })}
            placeholder="Marker name"
            className="h-8 text-sm bg-cyber-dark/60 border-cyber-purple/20"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-cyber-purple/20 hover:bg-cyber-purple/30"
            onClick={addMarker}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="glass-card p-3 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Song Structure</h3>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs">Start</span>
            <span className="text-xs">00:00.000</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">End</span>
            <span className="text-xs">01:30.000</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs">Loop Points</span>
            <Button variant="outline" size="sm" className="h-6 text-xs">
              Set Loop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkerList;
