
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Send } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond shortly!",
      });
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
            Contact Us
          </h1>
          
          <p className="text-lg text-white/70 mb-8 max-w-3xl">
            Have questions, feedback, or need assistance? Reach out to our team and we'll get back to you as soon as possible.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card p-8 rounded-lg">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-cyber-darker border-cyber-purple/20 text-white focus:border-cyber-red/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-cyber-darker border-cyber-purple/20 text-white focus:border-cyber-red/50"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="bg-cyber-darker border-cyber-purple/20 text-white focus:border-cyber-red/50"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="bg-cyber-darker border-cyber-purple/20 text-white focus:border-cyber-red/50 resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90 w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
            
            <div>
              <div className="glass-card p-8 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-cyber-red" />
                  Email Us
                </h3>
                <p className="text-white/70 mb-2">For general inquiries:</p>
                <a href="mailto:info@grecstudio.com" className="text-cyber-red hover:underline">
                  info@grecstudio.com
                </a>
                
                <p className="text-white/70 mt-4 mb-2">For support:</p>
                <a href="mailto:support@grecstudio.com" className="text-cyber-red hover:underline">
                  support@grecstudio.com
                </a>
              </div>
              
              <div className="glass-card p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-cyber-purple" />
                  Live Chat
                </h3>
                <p className="text-white/70 mb-4">
                  Chat with our support team in real-time during business hours.
                </p>
                <Button className="w-full bg-cyber-darker border border-cyber-purple/50 hover:bg-cyber-purple/20">
                  Start Chat
                </Button>
                
                <div className="mt-6">
                  <p className="text-white/70 mb-2">Hours of operation:</p>
                  <p className="text-sm text-white/70">Monday - Friday: 9 AM - 6 PM ET</p>
                  <p className="text-sm text-white/70">Saturday: 10 AM - 2 PM ET</p>
                  <p className="text-sm text-white/70">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
