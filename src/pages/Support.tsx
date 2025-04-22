
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How do I record audio in GRecStudio?",
    answer: "To record audio, click on the track you want to record to, then click the record button in the transport controls at the bottom of the screen. Make sure your microphone is properly connected and selected in the input settings. Click the record button again to stop recording."
  },
  {
    question: "Can I collaborate with others in real-time?",
    answer: "Yes! GRecStudio supports real-time collaboration. To invite collaborators, open your project, click on the collaborators icon in the top right, and use the '+ Invite' button. You can then specify their permissions and send them an invitation link."
  },
  {
    question: "How do I add effects to a track?",
    answer: "Select the track you want to add effects to, then navigate to the Effects tab in the right sidebar. From there, you can add EQ, reverb, compression, and other effects. Each effect has parameters you can adjust to suit your needs."
  },
  {
    question: "Is my data backed up automatically?",
    answer: "Yes, GRecStudio automatically saves your work to the cloud. Changes are saved in real-time, so you don't have to worry about losing your progress. You can also manually save versions of your project by clicking the Save button in the transport bar."
  },
  {
    question: "What audio file formats can I import?",
    answer: "GRecStudio supports common audio formats including WAV, MP3, AIFF, FLAC, and OGG. To import an audio file, you can drag and drop it into the timeline or use the Import option from the File menu."
  },
  {
    question: "How do I export my finished project?",
    answer: "To export your project, click on the Export button in the top menu. You can choose the format (WAV, MP3, etc.), quality settings, and whether to export individual tracks or the final mix. Once you've configured your export settings, click Export to save your project."
  },
  {
    question: "Can I use MIDI instruments in GRecStudio?",
    answer: "Yes, GRecStudio includes a variety of virtual MIDI instruments. To use them, create a new MIDI track, select the instrument you want to use from the instrument browser, and then use the piano roll editor to create or edit MIDI notes."
  },
  {
    question: "How do I adjust the timing of recorded audio?",
    answer: "You can adjust timing by selecting the audio clip and dragging it to a new position. For more precise control, you can use the time-stretching tool to extend or compress audio without changing pitch, or the grid snap features to align perfectly with the beat."
  }
];

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredFaqs = searchQuery 
    ? faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;
  
  return (
    <div className="min-h-screen bg-cyber-dark text-white flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-cyber-red to-cyber-purple bg-clip-text text-transparent">
            Support Center
          </h1>
          
          <p className="text-lg text-white/70 mb-8 max-w-3xl">
            Get help with GRecStudio. Browse our FAQs, search for answers, or contact our support team.
          </p>
          
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for help..."
                className="bg-cyber-darker border-cyber-purple/20 pl-10 py-6 text-white placeholder:text-white/50 focus:border-cyber-red/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-white/50 h-5 w-5" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-card p-6 text-center hover:border-cyber-red/50 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
              <p className="text-white/70 mb-4">New to GRecStudio? Learn the basics and set up your first project.</p>
              <Button variant="outline" className="border-cyber-red/50 hover:bg-cyber-red/20">
                View Guides
              </Button>
            </div>
            
            <div className="glass-card p-6 text-center hover:border-cyber-purple/50 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Video Tutorials</h3>
              <p className="text-white/70 mb-4">Watch step-by-step tutorials for all features and techniques.</p>
              <Button variant="outline" className="border-cyber-purple/50 hover:bg-cyber-purple/20">
                Watch Videos
              </Button>
            </div>
            
            <div className="glass-card p-6 text-center hover:border-cyber-blue/50 transition-colors">
              <h3 className="text-xl font-semibold mb-2">Community Forum</h3>
              <p className="text-white/70 mb-4">Connect with other users, share tips, and get community help.</p>
              <Button variant="outline" className="border-cyber-blue/50 hover:bg-cyber-blue/20">
                Join Discussion
              </Button>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-cyber-purple/20">
                  <AccordionTrigger className="text-left hover:text-cyber-red">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/70">No results found for "{searchQuery}"</p>
                <p className="text-white/50 mt-2">Try a different search term or contact support directly.</p>
              </div>
            )}
            
            <div className="mt-12 text-center p-8 glass-card">
              <h3 className="text-xl font-semibold mb-4">Still Need Help?</h3>
              <p className="text-white/70 mb-6">
                Our support team is ready to assist you with any questions or issues.
              </p>
              <Button className="bg-gradient-to-r from-cyber-red to-cyber-purple hover:opacity-90" asChild>
                <a href="/contact">Contact Support</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Support;
