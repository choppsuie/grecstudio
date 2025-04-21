
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MusicIcon, Users, Play, Save, Volume2, Edit } from "lucide-react";

const features = [
  {
    icon: <Users className="h-10 w-10 text-cyber-red" />,
    title: "Real-Time Collaboration",
    description: "Work on tracks simultaneously with musicians from around the world, seeing and hearing changes as they happen."
  },
  {
    icon: <MusicIcon className="h-10 w-10 text-cyber-purple" />,
    title: "Professional DAW Tools",
    description: "Access a full suite of virtual instruments, effects, and mixing capabilities right from your browser."
  },
  {
    icon: <Play className="h-10 w-10 text-cyber-cyan" />,
    title: "Low-Latency Monitoring",
    description: "Record with minimal delay for a seamless experience, as if everyone is in the same room."
  },
  {
    icon: <Save className="h-10 w-10 text-cyber-light-red" />,
    title: "Automatic Cloud Saving",
    description: "Never lose a take or idea with automatic cloud storage and version history tracking."
  },
  {
    icon: <Volume2 className="h-10 w-10 text-cyber-blue" />,
    title: "Built-in Communication",
    description: "Chat, video call, and leave comments directly within your project, streamlining your workflow."
  },
  {
    icon: <Edit className="h-10 w-10 text-cyber-red" />,
    title: "AI-Powered Assistance",
    description: "Let AI help with accompaniment suggestions, audio processing, and mixing recommendations."
  }
];

const Features = () => {
  return (
    <div className="py-20 bg-cyber-darker">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
            Powerful Features for Musicians
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            All the tools you need to create professional music, accessible from anywhere, with anyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card border-cyber-red/20 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/5 to-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader>
                <div className="mb-2 relative">
                  {feature.icon}
                  <div className="absolute inset-0 bg-cyber-red rounded-full blur-xl opacity-20 -z-10"></div>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/70 text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
