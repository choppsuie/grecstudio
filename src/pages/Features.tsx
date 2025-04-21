
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Music4, Users, Wand2, Mic2, BarChart2, Brain, 
  Clock, Cloud, Shield, Layers, Bot, Headphones 
} from "lucide-react";

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  badge 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  badge?: string;
}) => (
  <Card className="glass-card border-cyber-red/20 overflow-hidden group transition-all duration-300 hover:shadow-[0_0_15px_rgba(237,33,58,0.3)]">
    <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/5 to-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <CardHeader className="relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            {icon}
            <div className="absolute inset-0 bg-cyber-red rounded-full blur-xl opacity-20 -z-10"></div>
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        {badge && (
          <Badge className="bg-cyber-red/20 text-cyber-red border-cyber-red/30 hover:bg-cyber-red/30">
            {badge}
          </Badge>
        )}
      </div>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-white/70 text-base">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
);

const Features = () => {
  const features = [
    {
      icon: <Music4 className="h-8 w-8 text-cyber-red" />,
      title: "Virtual Studio",
      description: "Professional-grade audio workstation with fully featured mixing capabilities right in your browser.",
      badge: "Core"
    },
    {
      icon: <Users className="h-8 w-8 text-cyber-red" />,
      title: "Real-Time Collaboration",
      description: "Work with others simultaneously, see changes as they happen, and communicate within the app.",
      badge: "Core"
    },
    {
      icon: <Wand2 className="h-8 w-8 text-cyber-red" />,
      title: "AI-Assisted Creation",
      description: "Generate melodies, drum patterns, and even full tracks with cutting-edge AI technology.",
      badge: "Premium"
    },
    {
      icon: <Mic2 className="h-8 w-8 text-cyber-red" />,
      title: "Low-Latency Recording",
      description: "Record with minimal delay for a seamless experience, using advanced audio buffering.",
      badge: "Core"
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-cyber-red" />,
      title: "Advanced Analytics",
      description: "Track project metrics, listening statistics, and get insights on your music's performance.",
      badge: "Premium"
    },
    {
      icon: <Brain className="h-8 w-8 text-cyber-red" />,
      title: "Mix Assistant",
      description: "AI-powered mixing suggestions to help you achieve professional-quality sound.",
      badge: "Premium"
    },
    {
      icon: <Clock className="h-8 w-8 text-cyber-red" />,
      title: "Version History",
      description: "Track changes, compare versions, and roll back to previous iterations of your project.",
      badge: "Core"
    },
    {
      icon: <Cloud className="h-8 w-8 text-cyber-red" />,
      title: "Cloud Storage",
      description: "Store all your projects securely in the cloud with automatic backups and syncing.",
      badge: "Core"
    },
    {
      icon: <Shield className="h-8 w-8 text-cyber-red" />,
      title: "Secure Sharing",
      description: "Share your work with customizable access controls and protection for your intellectual property.",
      badge: "Core"
    },
    {
      icon: <Layers className="h-8 w-8 text-cyber-red" />,
      title: "Multi-track Support",
      description: "Work with unlimited audio and MIDI tracks for complex productions and arrangements.",
      badge: "Core"
    },
    {
      icon: <Bot className="h-8 w-8 text-cyber-red" />,
      title: "Virtual Instruments",
      description: "Access a growing library of high-quality software instruments for any genre.",
      badge: "Premium"
    },
    {
      icon: <Headphones className="h-8 w-8 text-cyber-red" />,
      title: "Real-time Audio Mastering",
      description: "Polish your tracks with one-click mastering powered by machine learning algorithms.",
      badge: "Premium"
    }
  ];

  return (
    <div className="min-h-screen bg-cyber-darker text-white">
      <Navbar />
      
      <div className="relative pt-28 pb-20">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-red opacity-20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple opacity-20 rounded-full blur-[100px]"></div>
          
          {/* Grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(237,33,58,0.15)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
              Professional Studio Features
            </h1>
            <p className="text-lg text-white/70">
              GRecStudio combines cutting-edge technology with intuitive design to provide everything you need for professional music production.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                badge={feature.badge}
              />
            ))}
          </div>
          
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
              Ready to Create?
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Join musicians worldwide and start collaborating on your next hit track today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90 text-white px-8">
                <Link to="/studio">
                  Launch Studio
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-cyber-red/50 hover:bg-cyber-red/20 text-white px-8">
                <Link to="/pricing">
                  See Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
