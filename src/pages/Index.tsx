
import { Navbar } from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Mic, Users, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";

const reviewsData = [
  {
    name: "Sarah J.",
    role: "Vocalist",
    comment: "GRecStudio's real-time collaboration has transformed how I work with producers. The sound quality is amazing, and I can record from anywhere.",
    avatar: "SJ"
  },
  {
    name: "Mike T.",
    role: "Producer",
    comment: "I've used many DAWs, but the ability to immediately collaborate with artists in GRecStudio is game-changing. My workflow is so much faster now.",
    avatar: "MT"
  },
  {
    name: "Chris L.",
    role: "Mixing Engineer",
    comment: "The AI-powered mixing suggestions have helped me find new approaches I wouldn't have considered. It's like having an assistant who never sleeps.",
    avatar: "CL"
  }
];

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      <Navbar />
      
      <Hero />
      
      <Features />
      
      {/* Pricing Section */}
      <div className="py-20 bg-cyber-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-cyber-red/50 text-cyber-red">
              Flexible Plans
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
              Choose the Right Plan for You
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Whether you're just starting out or working on professional projects, we have a plan that fits your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="glass-card border-cyber-red/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/5 to-cyber-red/0 opacity-50"></div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Starter</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">Free</span>
                </div>
                <p className="text-white/70 mb-6">Perfect for beginners and solo creators.</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-red mr-2 mt-0.5" />
                    <span>5 projects</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-red mr-2 mt-0.5" />
                    <span>Up to 8 tracks per project</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-red mr-2 mt-0.5" />
                    <span>1 GB storage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-red mr-2 mt-0.5" />
                    <span>Basic effects</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-cyber-darker border border-cyber-red/50 hover:bg-cyber-red/20 text-white"
                  asChild
                >
                  <Link to={user ? "/studio" : "/auth?sign-up=true"}>
                    {user ? "Open Studio" : "Sign Up Free"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Pro Plan */}
            <Card className="glass-card border-cyber-purple/30 relative overflow-hidden transform scale-105 shadow-lg shadow-cyber-purple/10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/10 to-cyber-purple/0 opacity-70"></div>
              <div className="absolute top-0 left-0 right-0 bg-cyber-purple text-white text-center text-sm py-1">
                Most Popular
              </div>
              <CardContent className="p-6 pt-10">
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$15</span>
                  <span className="text-white/70">/month</span>
                </div>
                <p className="text-white/70 mb-6">For serious musicians and producers.</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-purple mr-2 mt-0.5" />
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-purple mr-2 mt-0.5" />
                    <span>Up to 32 tracks per project</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-purple mr-2 mt-0.5" />
                    <span>25 GB storage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-purple mr-2 mt-0.5" />
                    <span>Advanced effects and instruments</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-purple mr-2 mt-0.5" />
                    <span>Real-time collaboration</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90"
                  asChild
                >
                  <Link to="/pricing">
                    Get Pro
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Studio Plan */}
            <Card className="glass-card border-cyber-blue/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 to-cyber-blue/0 opacity-50"></div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Studio</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-white/70">/month</span>
                </div>
                <p className="text-white/70 mb-6">For professional studios and teams.</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-blue mr-2 mt-0.5" />
                    <span>Everything in Pro, plus:</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-blue mr-2 mt-0.5" />
                    <span>Unlimited tracks per project</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-blue mr-2 mt-0.5" />
                    <span>100 GB storage</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-blue mr-2 mt-0.5" />
                    <span>Priority customer support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-cyber-blue mr-2 mt-0.5" />
                    <span>Advanced AI tools</span>
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-cyber-darker border border-cyber-blue/50 hover:bg-cyber-blue/20 text-white"
                  asChild
                >
                  <Link to="/pricing">
                    Get Studio
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      <div className="py-20 bg-cyber-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Join thousands of musicians and producers who are already creating amazing music with GRecStudio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {reviewsData.map((review, index) => (
              <Card key={index} className="glass-card border-cyber-red/20 hover:border-cyber-red/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-cyber-purple/20 flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">{review.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{review.name}</h4>
                      <p className="text-sm text-white/70">{review.role}</p>
                    </div>
                  </div>
                  <p className="text-white/80 italic">"{review.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 bg-cyber-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center glass-card p-12 rounded-lg relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyber-red/20 to-cyber-purple/20 opacity-50"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyber-red opacity-20 rounded-full blur-[80px]"></div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-8 md:mb-0 text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Create Music Together, Anywhere
                </h2>
                <p className="text-white/70">
                  Join GRecStudio today and transform your music production workflow with powerful tools, real-time collaboration, and AI-powered features.
                </p>
              </div>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90 text-white px-8 py-6"
                asChild
              >
                <Link to={user ? "/studio" : "/auth?sign-up=true"}>
                  {user ? "Go to Studio" : "Get Started Free"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
