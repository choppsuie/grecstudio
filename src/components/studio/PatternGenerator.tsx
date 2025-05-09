
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Stop, RefreshCw, Music, Disc } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useBeatGenerator, PatternType } from '@/hooks/useBeatGenerator';
import { usePianoGenerator, ChordProgressionType } from '@/hooks/usePianoGenerator';

interface PatternGeneratorProps {
  className?: string;
}

const PatternGenerator: React.FC<PatternGeneratorProps> = ({ className }) => {
  const {
    activePattern: beatPattern,
    patternType,
    isPlaying: isBeatPlaying,
    bpm,
    generatePattern,
    playPattern: playBeatPattern,
    stopPattern: stopBeatPattern,
    changeBpm,
    setPatternType
  } = useBeatGenerator();

  const {
    activePattern: pianoPattern,
    progressionType,
    isPlaying: isPianoPlaying,
    generatePattern: generatePianoPattern,
    playPattern: playPianoPattern,
    stopPattern: stopPianoPattern,
    setProgressionType
  } = usePianoGenerator();

  const [stopFunctions, setStopFunctions] = useState<(() => void)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  // Generate initial patterns on mount
  useEffect(() => {
    generatePattern('house');
    generatePianoPattern('pop');
  }, [generatePattern, generatePianoPattern]);

  // Simulated step sequencer animation
  useEffect(() => {
    let animationFrame: number;
    
    if (isBeatPlaying || isPianoPlaying) {
      const fps = 15;
      let lastFrame = 0;
      
      const animate = (timestamp: number) => {
        if (!lastFrame || timestamp - lastFrame >= 1000 / fps) {
          setActiveStep(prev => (prev + 1) % 16);
          lastFrame = timestamp;
        }
        animationFrame = requestAnimationFrame(animate);
      };
      
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isBeatPlaying, isPianoPlaying]);

  const handlePlayBeat = async () => {
    if (isBeatPlaying) {
      stopBeatPattern();
    } else if (beatPattern) {
      const stopFunc = await playBeatPattern(beatPattern);
      if (stopFunc) {
        setStopFunctions(prev => [...prev, stopFunc]);
      }
    }
  };

  const handlePlayPiano = async () => {
    if (isPianoPlaying) {
      stopPianoPattern();
    } else if (pianoPattern) {
      const stopFunc = await playPianoPattern(pianoPattern);
      if (stopFunc) {
        setStopFunctions(prev => [...prev, stopFunc]);
      }
    }
  };

  const handleStopAll = () => {
    stopFunctions.forEach(func => func());
    setStopFunctions([]);
  };

  const handleBeatTypeChange = (value: PatternType) => {
    setPatternType(value);
    generatePattern(value);
  };

  const handlePianoTypeChange = (value: ChordProgressionType) => {
    setProgressionType(value);
    generatePianoPattern(value);
  };

  // Visualize the drum pattern
  const renderBeatVisualizer = () => {
    if (!beatPattern) return null;
    
    const instrumentNames = ['Kick', 'Snare', 'Hi-hat', 'Clap', 'Tom', 'Perc'];
    const instrumentKeys = ['kick', 'snare', 'hihat', 'clap', 'tom', 'perc'] as const;
    const instrumentColors = [
      'bg-red-500', 'bg-blue-500', 'bg-yellow-500', 
      'bg-green-500', 'bg-purple-500', 'bg-pink-500'
    ];
    
    return (
      <div className="mt-4 overflow-x-auto">
        <div className="grid grid-rows-6 gap-1 min-w-[300px]">
          {instrumentKeys.map((key, idx) => (
            <div key={key} className="flex items-center">
              <span className="text-xs w-10 text-cyber-text-muted">{instrumentNames[idx]}</span>
              <div className="grid grid-cols-16 gap-1 flex-1">
                {beatPattern[key].map((active, step) => (
                  <div 
                    key={`${key}-${step}`}
                    className={`
                      h-6 rounded transition-all
                      ${active 
                        ? `${instrumentColors[idx]} ${step === activeStep ? 'animate-pulse shadow-glow' : 'opacity-80'}` 
                        : 'bg-cyber-dark'}
                      ${step === activeStep && isBeatPlaying ? 'ring-1 ring-white' : ''}
                    `}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Visualize the piano pattern
  const renderPianoVisualizer = () => {
    if (!pianoPattern) return null;
    
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Map each note to its visual position on the piano roll (0 = C2, 36 = C5)
    const getNotePosition = (note: string) => {
      // Extract note name and octave (e.g., "C4" -> "C" and 4)
      const noteName = note.replace(/\d/g, '');
      const octave = parseInt(note.replace(/[^\d]/g, ''), 10);
      
      // Find the note index
      const noteIndex = notes.indexOf(noteName);
      if (noteIndex === -1) return -1;
      
      // Calculate position
      return (octave - 2) * 12 + noteIndex;
    };
    
    // Create a 2D grid representing the piano roll
    // 36 rows (3 octaves) by 16 columns (16 steps)
    const pianoRoll = Array(36).fill(0).map(() => Array(16).fill(false));
    
    // Fill in the piano roll with melody notes
    pianoPattern.melody.forEach((note, index) => {
      const position = getNotePosition(note);
      if (position >= 0 && position < 36) {
        pianoRoll[35 - position][index] = true;
      }
    });
    
    return (
      <div className="mt-4 overflow-x-auto overflow-y-hidden h-64">
        <div className="relative h-full">
          {/* Piano roll visualization */}
          <div className="grid grid-cols-16 grid-rows-36 gap-[1px] h-full">
            {pianoRoll.map((row, rowIdx) => (
              <React.Fragment key={`row-${rowIdx}`}>
                {row.map((active, colIdx) => {
                  // Determine if this is a black or white key
                  const notePosition = 35 - rowIdx;
                  const noteName = notes[notePosition % 12];
                  const isBlackKey = noteName?.includes('#');
                  
                  return (
                    <div 
                      key={`cell-${rowIdx}-${colIdx}`}
                      className={`
                        border-r border-cyber-purple/10
                        ${isBlackKey ? 'bg-cyber-darker' : 'bg-cyber-dark'}
                        ${active ? 'bg-cyber-purple' : ''}
                        ${colIdx === activeStep && isPianoPlaying && active 
                          ? 'animate-pulse shadow-glow' : ''}
                      `}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          
          {/* Vertical playhead */}
          {isPianoPlaying && (
            <div 
              className="absolute top-0 h-full w-[6.25%] bg-white/5 border-r border-cyber-red pointer-events-none"
              style={{ left: `${activeStep * 6.25}%` }}
            ></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      <Card className="bg-cyber-darker border-cyber-purple/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center">
              <Music className="mr-2 h-5 w-5 text-cyber-purple" />
              Pattern Generator
            </span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 bg-cyber-dark hover:bg-cyber-purple/20"
                onClick={handleStopAll}
              >
                <Stop className="h-4 w-4" />
                <span>Stop All</span>
              </Button>
              <span className="text-xs font-normal text-cyber-text-muted">BPM</span>
              <Slider 
                value={[bpm]} 
                min={60} 
                max={180} 
                step={1}
                onValueChange={(vals) => changeBpm(vals[0])} 
                className="w-24"
              />
              <span className="text-xs font-normal text-cyber-text-muted">{bpm}</span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="beats">
            <TabsList className="bg-cyber-dark mb-4">
              <TabsTrigger value="beats" className="data-[state=active]:bg-cyber-purple/20">
                <Disc className="h-4 w-4 mr-2" />
                Beat Generator
              </TabsTrigger>
              <TabsTrigger value="piano" className="data-[state=active]:bg-cyber-purple/20">
                <Music className="h-4 w-4 mr-2" />
                Piano Generator
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="beats">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Select value={patternType} onValueChange={(val) => handleBeatTypeChange(val as PatternType)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Pattern Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="trap">Trap</SelectItem>
                      <SelectItem value="techno">Techno</SelectItem>
                      <SelectItem value="hiphop">Hip Hop</SelectItem>
                      <SelectItem value="ambient">Ambient</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => generatePattern(patternType)}
                    className="bg-cyber-dark hover:bg-cyber-purple/20"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
                
                <Button 
                  onClick={handlePlayBeat}
                  variant={isBeatPlaying ? "destructive" : "default"}
                  size="sm"
                  className={isBeatPlaying ? "" : "bg-cyber-purple hover:bg-cyber-purple/80"}
                >
                  {isBeatPlaying ? (
                    <>
                      <Stop className="h-4 w-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
              </div>
              
              {renderBeatVisualizer()}
            </TabsContent>
            
            <TabsContent value="piano">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Select value={progressionType} onValueChange={(val) => handlePianoTypeChange(val as ChordProgressionType)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="jazz">Jazz</SelectItem>
                      <SelectItem value="classical">Classical</SelectItem>
                      <SelectItem value="lofi">Lo-Fi</SelectItem>
                      <SelectItem value="electronic">Electronic</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => generatePianoPattern(progressionType)}
                    className="bg-cyber-dark hover:bg-cyber-purple/20"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
                
                <Button 
                  onClick={handlePlayPiano}
                  variant={isPianoPlaying ? "destructive" : "default"}
                  size="sm"
                  className={isPianoPlaying ? "" : "bg-cyber-purple hover:bg-cyber-purple/80"}
                >
                  {isPianoPlaying ? (
                    <>
                      <Stop className="h-4 w-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
              </div>
              
              {renderPianoVisualizer()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatternGenerator;
