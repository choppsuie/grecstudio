
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Flag, Trash2, Edit2, Plus, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudio } from '@/contexts/StudioHooks';

export interface Marker {
  id: string;
  name: string;
  time: number;
  color: string;
  comments?: string;
}

interface MarkerEditorProps {
  markers: Marker[];
  onChange: (markers: Marker[]) => void;
}

// Format time as mm:ss.ms
const formatTimeStamp = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const ms = Math.floor((timeInSeconds % 1) * 1000);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
};

const availableColors = [
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Cyan', value: '#06B6D4' },
];

const MarkerEditor: React.FC<MarkerEditorProps> = ({ markers: initialMarkers, onChange }) => {
  const { currentTime, seekToPosition } = useStudio();
  const [markers, setMarkers] = useState<Marker[]>(initialMarkers);
  const [editingMarkerId, setEditingMarkerId] = useState<string | null>(null);
  const [editedMarker, setEditedMarker] = useState<Marker | null>(null);
  
  // Update internal state when props change
  useEffect(() => {
    setMarkers(initialMarkers);
  }, [initialMarkers]);
  
  const handleAddMarker = () => {
    const newMarker: Marker = {
      id: `marker_${Date.now()}`,
      name: `Marker ${markers.length + 1}`,
      time: currentTime,
      color: availableColors[markers.length % availableColors.length].value
    };
    
    const updatedMarkers = [...markers, newMarker];
    setMarkers(updatedMarkers);
    onChange(updatedMarkers);
    
    // Start editing the new marker
    setEditingMarkerId(newMarker.id);
    setEditedMarker(newMarker);
  };
  
  const handleDeleteMarker = (id: string) => {
    const updatedMarkers = markers.filter(marker => marker.id !== id);
    setMarkers(updatedMarkers);
    onChange(updatedMarkers);
  };
  
  const handleEditMarker = (marker: Marker) => {
    setEditingMarkerId(marker.id);
    setEditedMarker({...marker});
  };
  
  const handleSaveEdit = () => {
    if (!editedMarker) return;
    
    const updatedMarkers = markers.map(marker => 
      marker.id === editedMarker.id ? editedMarker : marker
    );
    
    setMarkers(updatedMarkers);
    onChange(updatedMarkers);
    setEditingMarkerId(null);
    setEditedMarker(null);
  };
  
  const handleCancelEdit = () => {
    setEditingMarkerId(null);
    setEditedMarker(null);
  };
  
  const handleGoToMarker = (time: number) => {
    seekToPosition(time);
  };
  
  const handleChangeMarkerField = (field: keyof Marker, value: any) => {
    if (!editedMarker) return;
    
    setEditedMarker({
      ...editedMarker,
      [field]: field === 'time' ? parseFloat(value) : value
    });
  };
  
  // Sort markers by time
  const sortedMarkers = [...markers].sort((a, b) => a.time - b.time);
  
  return (
    <div className="bg-cyber-dark p-4 rounded-md border border-cyber-purple/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-cyber-purple">Timeline Markers</h3>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleAddMarker}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Marker at Current Position</span>
        </Button>
      </div>
      
      <div className="overflow-hidden border border-cyber-purple/20 rounded-md">
        <Table>
          <TableHeader className="bg-cyber-darker">
            <TableRow>
              <TableHead className="w-10">Color</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-32">Time</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMarkers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-cyber-purple/50">
                  No markers set. Add a marker to organize your timeline.
                </TableCell>
              </TableRow>
            ) : (
              sortedMarkers.map((marker) => (
                <TableRow key={marker.id} className={editingMarkerId === marker.id ? "bg-cyber-darker/70" : ""}>
                  <TableCell>
                    {editingMarkerId === marker.id ? (
                      <div className="flex gap-1">
                        {availableColors.map(color => (
                          <button
                            key={color.value}
                            className={cn(
                              "w-4 h-4 rounded-full",
                              editedMarker?.color === color.value && "ring-2 ring-white ring-offset-1 ring-offset-cyber-dark"
                            )}
                            style={{ backgroundColor: color.value }}
                            onClick={() => handleChangeMarkerField('color', color.value)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    ) : (
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: marker.color }} 
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {editingMarkerId === marker.id ? (
                      <Input
                        className="h-7 bg-cyber-darker border-cyber-purple/30"
                        value={editedMarker?.name || ''}
                        onChange={(e) => handleChangeMarkerField('name', e.target.value)}
                      />
                    ) : (
                      marker.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingMarkerId === marker.id ? (
                      <Input
                        className="h-7 bg-cyber-darker border-cyber-purple/30"
                        value={editedMarker?.time || 0}
                        onChange={(e) => handleChangeMarkerField('time', e.target.value)}
                        type="number"
                        step="0.001"
                      />
                    ) : (
                      <span className="font-mono text-sm">{formatTimeStamp(marker.time)}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingMarkerId === marker.id ? (
                      <Input
                        className="h-7 bg-cyber-darker border-cyber-purple/30"
                        value={editedMarker?.comments || ''}
                        onChange={(e) => handleChangeMarkerField('comments', e.target.value)}
                        placeholder="Add comments..."
                      />
                    ) : (
                      marker.comments || <span className="text-cyber-purple/40 italic text-sm">No comments</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {editingMarkerId === marker.id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={handleSaveEdit}
                        >
                          <Save className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:text-cyber-purple"
                          onClick={() => handleGoToMarker(marker.time)}
                          title="Go to marker"
                        >
                          <Flag className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:text-cyber-blue"
                          onClick={() => handleEditMarker(marker)}
                          title="Edit marker"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:text-cyber-red"
                          onClick={() => handleDeleteMarker(marker.id)}
                          title="Delete marker"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MarkerEditor;
