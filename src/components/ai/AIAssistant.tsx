
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Music, Send, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIResponse {
  id: string;
  prompt: string;
  response: string;
  timestamp: Date;
  type: "general" | "progression" | "melody";
}

interface AIAssistantProps {
  onGenerateProgression?: (notes: string[]) => void;
  onGenerateMelody?: (notes: string[]) => void;
}

const AIAssistant = ({ onGenerateProgression, onGenerateMelody }: AIAssistantProps) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();

  const generateResponse = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      // This would normally call a backend API
      // For demo purposes, we'll simulate responses
      
      let response: string;
      let generatedNotes: string[] = [];
      
      // Simulate different responses based on the active tab
      switch (activeTab) {
        case "progression":
          response = "I've generated a chord progression in C major: C - Am - F - G";
          generatedNotes = ["C", "Am", "F", "G"];
          onGenerateProgression?.(generatedNotes);
          break;
        case "melody":
          response = "Here's a melody that might work well: C D E G E D C";
          generatedNotes = ["C4", "D4", "E4", "G4", "E4", "D4", "C4"];
          onGenerateMelody?.(generatedNotes);
          break;
        default:
          response = `Based on your input "${prompt}", you might want to try adding more dynamics in the chorus and experimenting with a counter-melody in the bridge section. Consider using a minor key for a more emotional feel.`;
      }
      
      // Add the response to our history
      const newResponse: AIResponse = {
        id: Date.now().toString(),
        prompt,
        response,
        timestamp: new Date(),
        type: activeTab as any,
      };
      
      setResponses(prev => [newResponse, ...prev]);
      setPrompt("");
      
      toast({
        title: "AI Response Generated",
        description: "The AI assistant has provided a suggestion.",
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      toast({
        title: "AI Generation Failed",
        description: "There was an error generating the AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-4 bg-cyber-darker border border-cyber-purple/20 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">AI Music Assistant</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="progression">Chord Progression</TabsTrigger>
          <TabsTrigger value="melody">Melody</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <p className="text-sm text-white/70 mb-4">
            Ask for music production tips, arrangement ideas, or mixing advice.
          </p>
        </TabsContent>
        
        <TabsContent value="progression">
          <p className="text-sm text-white/70 mb-4">
            Generate chord progressions by describing the mood or style you want.
          </p>
        </TabsContent>
        
        <TabsContent value="melody">
          <p className="text-sm text-white/70 mb-4">
            Generate melodies that fit your project by describing the feel or emotion.
          </p>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={activeTab === "general" 
              ? "How can I improve my mix?" 
              : activeTab === "progression" 
                ? "Generate a sad chord progression in A minor" 
                : "Create an uplifting melody for my chorus"
            }
            className="resize-none border-cyber-purple/20 focus-visible:ring-cyber-purple/30"
          />
          <Button
            onClick={generateResponse}
            disabled={isLoading || !prompt.trim()}
            className="bg-cyber-purple hover:bg-cyber-purple/80 self-end"
          >
            {isLoading ? (
              <span className="animate-pulse">Thinking...</span>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                <span>Ask</span>
              </>
            )}
          </Button>
        </div>
        
        {responses.length > 0 && (
          <div className="border-t border-cyber-purple/10 pt-4">
            <h4 className="text-sm font-medium mb-2">AI Suggestions</h4>
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {responses.map(response => (
                <div key={response.id} className="bg-cyber-dark/40 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-cyber-purple/30 flex items-center justify-center mr-2 mt-1">
                      {response.type === "general" ? (
                        <Brain className="h-4 w-4" />
                      ) : response.type === "progression" ? (
                        <Music className="h-4 w-4" />
                      ) : (
                        <Wand2 className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-white/40 mb-1">
                        {response.type === "general" 
                          ? "General Advice" 
                          : response.type === "progression" 
                            ? "Chord Progression" 
                            : "Melody"
                        }
                      </p>
                      <p className="text-xs text-white/60 italic mb-1">"{response.prompt}"</p>
                      <p className="text-sm">{response.response}</p>
                      
                      {(response.type === "progression" || response.type === "melody") && (
                        <div className="mt-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs border-cyber-purple/30 hover:bg-cyber-purple/10"
                            onClick={() => {
                              const notes = response.response
                                .split(":")[1]
                                .trim()
                                .split(" - ")
                                .map(n => n.trim());
                              
                              if (response.type === "progression") {
                                onGenerateProgression?.(notes);
                              } else {
                                onGenerateMelody?.(notes.map(n => `${n}4`));
                              }
                              
                              toast({
                                title: "Applied to project",
                                description: `The ${response.type === "progression" ? "chord progression" : "melody"} has been applied to your project.`
                              });
                            }}
                          >
                            Apply to Project
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-right text-xs text-white/40 mt-2">
                    {response.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
