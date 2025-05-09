
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Plus, Trash2, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MIDIEvent {
  id: string;
  type: 'noteOn' | 'noteOff' | 'cc' | 'pitchBend' | 'programChange';
  time: number;
  note?: number;
  velocity?: number;
  controller?: number;
  value?: number;
  channel: number;
}

interface EventsListEditorProps {
  events: MIDIEvent[];
  onEventsChange: (events: MIDIEvent[]) => void;
  onClose?: () => void;
}

// Helper function to get note name
const getNoteNameFromNumber = (noteNumber: number): string => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(noteNumber / 12) - 1;
  const note = notes[noteNumber % 12];
  return `${note}${octave}`;
};

// Format time as bars:beats:ticks
const formatTime = (time: number): string => {
  const bars = Math.floor(time);
  const beats = Math.floor((time - bars) * 4) + 1;
  const ticks = Math.floor(((time - bars) * 4 - (beats - 1)) * 960);
  return `${bars + 1}:${beats}:${ticks.toString().padStart(3, '0')}`;
};

const EventsListEditor: React.FC<EventsListEditorProps> = ({
  events: initialEvents,
  onEventsChange,
  onClose,
}) => {
  const [events, setEvents] = useState<MIDIEvent[]>(initialEvents);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof MIDIEvent>('time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  
  // Handle event edit
  const handleEdit = (eventId: string) => {
    setEditingEvent(eventId);
  };
  
  // Handle saving edited event
  const handleSave = (event: MIDIEvent) => {
    setEvents(events.map(e => e.id === event.id ? event : e));
    setEditingEvent(null);
    onEventsChange(events);
  };
  
  // Handle adding a new event
  const handleAddEvent = () => {
    const newEvent: MIDIEvent = {
      id: `event_${Date.now()}`,
      type: 'noteOn',
      time: 0,
      note: 60,
      velocity: 100,
      channel: 1
    };
    
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    onEventsChange(updatedEvents);
    setEditingEvent(newEvent.id);
  };
  
  // Handle deleting events
  const handleDelete = () => {
    const updatedEvents = events.filter(e => !selectedEvents.includes(e.id));
    setEvents(updatedEvents);
    setSelectedEvents([]);
    onEventsChange(updatedEvents);
  };
  
  // Handle sort
  const handleSort = (field: keyof MIDIEvent) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };
  
  // Handle selection
  const toggleSelection = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };
  
  // Handle field value change
  const handleFieldChange = (eventId: string, field: string, value: any) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          [field]: field === 'note' || field === 'velocity' || field === 'controller' || field === 'value' || field === 'channel'
            ? parseInt(value, 10)
            : field === 'time'
              ? parseFloat(value)
              : value
        };
      }
      return event;
    }));
  };
  
  // Filter and sort events
  const filteredAndSortedEvents = events
    .filter(event => {
      if (!filter) return true;
      const searchTerm = filter.toLowerCase();
      return (
        event.type.toLowerCase().includes(searchTerm) ||
        event.channel.toString().includes(searchTerm) ||
        (event.note && getNoteNameFromNumber(event.note).toLowerCase().includes(searchTerm)) ||
        formatTime(event.time).includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === bValue) return 0;
      
      const result = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? result : -result;
    });
  
  return (
    <div className="bg-cyber-darker border border-cyber-purple/20 rounded-md overflow-hidden shadow-lg">
      <div className="p-3 border-b border-cyber-purple/20 flex justify-between items-center">
        <h3 className="text-lg font-medium text-cyber-purple">MIDI Events List</h3>
        
        <div className="flex items-center space-x-2">
          <Input
            className="h-8 w-48 bg-cyber-dark border-cyber-purple/30 text-sm"
            placeholder="Filter events..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs flex items-center gap-1 border-cyber-purple/30"
            onClick={handleAddEvent}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Event</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs flex items-center gap-1 border-cyber-purple/30"
            onClick={handleDelete}
            disabled={selectedEvents.length === 0}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>
          
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>
      
      <div className="overflow-auto max-h-[600px]">
        <Table>
          <TableHeader className="bg-cyber-dark/80 sticky top-0">
            <TableRow>
              <TableHead className="w-8 px-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-cyber-purple/30"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedEvents(events.map(event => event.id));
                    } else {
                      setSelectedEvents([]);
                    }
                  }}
                  checked={selectedEvents.length === events.length && events.length > 0}
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('time')}>
                <div className="flex items-center">
                  Time
                  {sortField === 'time' && (
                    <ArrowUpDown className={cn("ml-1 h-3 w-3", sortDirection === 'desc' && "transform rotate-180")} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>
                <div className="flex items-center">
                  Event Type
                  {sortField === 'type' && (
                    <ArrowUpDown className={cn("ml-1 h-3 w-3", sortDirection === 'desc' && "transform rotate-180")} />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('channel')}>
                <div className="flex items-center">
                  Channel
                  {sortField === 'channel' && (
                    <ArrowUpDown className={cn("ml-1 h-3 w-3", sortDirection === 'desc' && "transform rotate-180")} />
                  )}
                </div>
              </TableHead>
              <TableHead>Note/Controller</TableHead>
              <TableHead>Velocity/Value</TableHead>
              <TableHead className="w-16 text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedEvents.map((event) => (
              <TableRow
                key={event.id}
                className={cn(
                  selectedEvents.includes(event.id) && "bg-cyber-purple/10",
                  editingEvent === event.id && "bg-cyber-dark/80"
                )}
              >
                <TableCell className="px-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-cyber-purple/30"
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => toggleSelection(event.id)}
                  />
                </TableCell>
                <TableCell>
                  {editingEvent === event.id ? (
                    <Input
                      className="h-7 w-full bg-cyber-dark border-cyber-purple/30"
                      value={event.time}
                      onChange={(e) => handleFieldChange(event.id, 'time', e.target.value)}
                    />
                  ) : (
                    formatTime(event.time)
                  )}
                </TableCell>
                <TableCell>
                  {editingEvent === event.id ? (
                    <select
                      className="h-7 w-full bg-cyber-dark border border-cyber-purple/30 rounded-md text-sm"
                      value={event.type}
                      onChange={(e) => handleFieldChange(event.id, 'type', e.target.value)}
                    >
                      <option value="noteOn">Note On</option>
                      <option value="noteOff">Note Off</option>
                      <option value="cc">CC</option>
                      <option value="pitchBend">Pitch Bend</option>
                      <option value="programChange">Program Change</option>
                    </select>
                  ) : (
                    event.type === 'noteOn' ? 'Note On' :
                    event.type === 'noteOff' ? 'Note Off' :
                    event.type === 'cc' ? 'CC' :
                    event.type === 'pitchBend' ? 'Pitch Bend' :
                    'Program Change'
                  )}
                </TableCell>
                <TableCell>
                  {editingEvent === event.id ? (
                    <Input
                      className="h-7 w-16 bg-cyber-dark border-cyber-purple/30"
                      value={event.channel}
                      onChange={(e) => handleFieldChange(event.id, 'channel', e.target.value)}
                      min={1}
                      max={16}
                      type="number"
                    />
                  ) : (
                    event.channel
                  )}
                </TableCell>
                <TableCell>
                  {editingEvent === event.id ? (
                    (event.type === 'noteOn' || event.type === 'noteOff') ? (
                      <Input
                        className="h-7 w-16 bg-cyber-dark border-cyber-purple/30"
                        value={event.note}
                        onChange={(e) => handleFieldChange(event.id, 'note', e.target.value)}
                        min={0}
                        max={127}
                        type="number"
                      />
                    ) : event.type === 'cc' ? (
                      <Input
                        className="h-7 w-16 bg-cyber-dark border-cyber-purple/30"
                        value={event.controller}
                        onChange={(e) => handleFieldChange(event.id, 'controller', e.target.value)}
                        min={0}
                        max={127}
                        type="number"
                      />
                    ) : (
                      <span className="text-cyber-purple/50">—</span>
                    )
                  ) : (
                    (event.type === 'noteOn' || event.type === 'noteOff') ? (
                      <span>
                        {event.note} <span className="text-cyber-purple/70">({getNoteNameFromNumber(event.note || 60)})</span>
                      </span>
                    ) : event.type === 'cc' ? (
                      <span>CC {event.controller}</span>
                    ) : (
                      <span className="text-cyber-purple/50">—</span>
                    )
                  )}
                </TableCell>
                <TableCell>
                  {editingEvent === event.id ? (
                    (event.type === 'noteOn' || event.type === 'noteOff') ? (
                      <Input
                        className="h-7 w-16 bg-cyber-dark border-cyber-purple/30"
                        value={event.velocity}
                        onChange={(e) => handleFieldChange(event.id, 'velocity', e.target.value)}
                        min={0}
                        max={127}
                        type="number"
                      />
                    ) : (event.type === 'cc' || event.type === 'pitchBend' || event.type === 'programChange') ? (
                      <Input
                        className="h-7 w-16 bg-cyber-dark border-cyber-purple/30"
                        value={event.value}
                        onChange={(e) => handleFieldChange(event.id, 'value', e.target.value)}
                        min={0}
                        max={event.type === 'pitchBend' ? 16383 : 127}
                        type="number"
                      />
                    ) : (
                      <span className="text-cyber-purple/50">—</span>
                    )
                  ) : (
                    (event.type === 'noteOn' || event.type === 'noteOff') ? (
                      event.velocity
                    ) : (event.type === 'cc' || event.type === 'pitchBend' || event.type === 'programChange') ? (
                      event.value
                    ) : (
                      <span className="text-cyber-purple/50">—</span>
                    )
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingEvent === event.id ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleSave(event)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleEdit(event.id)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-3 border-t border-cyber-purple/20 flex justify-between">
        <div className="text-sm text-cyber-purple/70">
          {filteredAndSortedEvents.length} events
          {selectedEvents.length > 0 && ` (${selectedEvents.length} selected)`}
        </div>
        
        <Button
          variant="default"
          className="bg-cyber-purple hover:bg-cyber-purple/90"
          onClick={() => onEventsChange(events)}
        >
          Apply Changes
        </Button>
      </div>
    </div>
  );
};

export default EventsListEditor;
