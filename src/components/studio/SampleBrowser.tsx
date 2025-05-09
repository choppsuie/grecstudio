
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Disc, 
  Music, 
  Folder, 
  Search, 
  Star, 
  Clock, 
  Play, 
  Pause, 
  Heart, 
  HeartOff,
  Plus
} from 'lucide-react';

// Sample data
const sampleCategories = [
  { id: "drums", name: "Drums & Percussion" },
  { id: "bass", name: "Bass" },
  { id: "synth", name: "Synth Sounds" },
  { id: "fx", name: "Sound FX" },
  { id: "vocals", name: "Vocal Loops" },
  { id: "acoustic", name: "Acoustic" },
  { id: "orchestral", name: "Orchestral" }
];

const samplePacks = [
  { id: "pack1", name: "EDM Essentials", count: 240 },
  { id: "pack2", name: "Lo-Fi Hip Hop Kit", count: 185 },
  { id: "pack3", name: "Cyberpunk Textures", count: 120 },
  { id: "pack4", name: "Trap Master", count: 210 },
  { id: "pack5", name: "Analog Synths", count: 95 },
  { id: "pack6", name: "Cinematic Impacts", count: 75 },
  { id: "pack7", name: "Classic Drum Machines", count: 150 }
];

const samples = [
  { id: "s1", name: "808 Kick", category: "drums", duration: "0:02", packId: "pack1", favorite: true },
  { id: "s2", name: "Analog Snare", category: "drums", duration: "0:01", packId: "pack1", favorite: false },
  { id: "s3", name: "Synth Pad C", category: "synth", duration: "0:08", packId: "pack5", favorite: true },
  { id: "s4", name: "Ambient Texture", category: "synth", duration: "0:15", packId: "pack3", favorite: false },
  { id: "s5", name: "Sub Bass G", category: "bass", duration: "0:04", packId: "pack2", favorite: false },
  { id: "s6", name: "Vinyl Crackle", category: "fx", duration: "0:10", packId: "pack2", favorite: true },
  { id: "s7", name: "Clap Reverb", category: "drums", duration: "0:02", packId: "pack4", favorite: false },
  { id: "s8", name: "808 Hat Closed", category: "drums", duration: "0:01", packId: "pack1", favorite: false },
  { id: "s9", name: "Cinematic Rise", category: "fx", duration: "0:12", packId: "pack6", favorite: true },
  { id: "s10", name: "Piano Chord Em", category: "acoustic", duration: "0:06", packId: "pack2", favorite: false },
  { id: "s11", name: "Glitch Effect", category: "fx", duration: "0:03", packId: "pack3", favorite: false },
  { id: "s12", name: "TR-909 Kick", category: "drums", duration: "0:01", packId: "pack7", favorite: true },
];

const SampleBrowser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [playingSample, setPlayingSample] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>(
    samples.reduce((acc, sample) => ({ ...acc, [sample.id]: sample.favorite }), {})
  );
  
  const handlePlaySample = (sampleId: string) => {
    if (playingSample === sampleId) {
      setPlayingSample(null);
    } else {
      setPlayingSample(sampleId);
      // In a real app, you'd play the sample here using Tone.js
      setTimeout(() => setPlayingSample(null), 2000); // Simulate playing for 2 seconds
    }
  };
  
  const toggleFavorite = (sampleId: string) => {
    setFavorites(prev => ({
      ...prev,
      [sampleId]: !prev[sampleId]
    }));
  };
  
  const filteredSamples = samples.filter(sample => {
    // Apply category filter
    if (selectedCategory && sample.category !== selectedCategory) return false;
    
    // Apply pack filter
    if (selectedPack && sample.packId !== selectedPack) return false;
    
    // Apply search query
    if (searchQuery && !sample.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  return (
    <div className="bg-cyber-darker border border-cyber-purple/20 rounded-md h-full flex flex-col">
      <div className="p-3 border-b border-cyber-purple/10 flex items-center justify-between">
        <h3 className="text-sm font-medium text-cyber-text">Sample Browser</h3>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Clock className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-cyber-purple" />
          <Input
            placeholder="Search samples..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="categories" className="flex-1 flex flex-col">
        <TabsList className="flex justify-evenly px-3 bg-transparent border-b border-cyber-purple/10">
          <TabsTrigger value="categories" className="flex-1 data-[state=active]:bg-cyber-purple/20 rounded-none rounded-t-sm">
            <Disc className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="packs" className="flex-1 data-[state=active]:bg-cyber-purple/20 rounded-none rounded-t-sm">
            <Folder className="h-4 w-4 mr-2" />
            Sample Packs
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex-1 data-[state=active]:bg-cyber-purple/20 rounded-none rounded-t-sm">
            <Heart className="h-4 w-4 mr-2" />
            Favorites
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="categories" className="h-full m-0">
            <div className="grid grid-cols-2 gap-2 p-3 h-32 overflow-y-auto">
              {sampleCategories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  className="justify-start h-8"
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                >
                  <Music className="h-3.5 w-3.5 mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="packs" className="h-full m-0">
            <div className="grid grid-cols-1 gap-1 p-3 h-32 overflow-y-auto">
              {samplePacks.map(pack => (
                <Button
                  key={pack.id}
                  variant={selectedPack === pack.id ? "default" : "outline"}
                  size="sm"
                  className="justify-start h-8"
                  onClick={() => setSelectedPack(
                    selectedPack === pack.id ? null : pack.id
                  )}
                >
                  <Folder className="h-3.5 w-3.5 mr-2" />
                  {pack.name}
                  <span className="ml-auto text-xs opacity-70">{pack.count}</span>
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="h-full m-0">
            <div className="p-3 h-32 overflow-y-auto">
              {samples.filter(s => favorites[s.id]).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-cyber-text-muted">
                  <Heart className="h-8 w-8 mb-2 text-cyber-purple/50" />
                  <p className="text-xs">No favorite samples yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {samples
                    .filter(s => favorites[s.id])
                    .map(sample => (
                      <div 
                        key={sample.id}
                        className="flex items-center p-2 hover:bg-cyber-purple/10 rounded-sm"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handlePlaySample(sample.id)}
                        >
                          {playingSample === sample.id ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <span className="text-xs ml-2">{sample.name}</span>
                        <span className="text-xs ml-auto text-cyber-text-muted">{sample.duration}</span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </TabsContent>
        </div>
        
        <div className="border-t border-cyber-purple/10">
          <ScrollArea className="h-[180px] p-3">
            <div className="space-y-1">
              {filteredSamples.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-cyber-text-muted">
                  <Search className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-xs">No samples found</p>
                </div>
              ) : (
                filteredSamples.map(sample => (
                  <div 
                    key={sample.id}
                    className="flex items-center p-2 hover:bg-cyber-purple/10 rounded-sm group"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handlePlaySample(sample.id)}
                    >
                      {playingSample === sample.id ? (
                        <Pause className="h-3.5 w-3.5" />
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <span className="text-xs ml-2">{sample.name}</span>
                    <span className="text-xs ml-auto mr-2 text-cyber-text-muted">{sample.duration}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => toggleFavorite(sample.id)}
                    >
                      {favorites[sample.id] ? (
                        <Heart className="h-3.5 w-3.5 fill-cyber-purple text-cyber-purple" />
                      ) : (
                        <Heart className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Add to project"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
};

export default SampleBrowser;
