
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  created_at: string;
}

interface ChatProps {
  user: User | null;
}

const Chat = ({ user }: ChatProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // In a complete implementation, we would fetch messages from Supabase
    // and subscribe to real-time updates
    
    // Mock data for now
    setMessages([
      {
        id: '1',
        content: 'Hey, I think we should add a bass line in the second verse.',
        sender_id: '1',
        sender_name: 'Alice Cooper',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: '2',
        content: 'Good idea! I can work on that. What about adding some keys too?',
        sender_id: '2',
        sender_name: 'Bob Dylan',
        created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      }
    ]);
    
    // Set up real-time subscription for new messages
    const channel = supabase.channel('studio_chat');
    
    channel
      .on('broadcast', { event: 'new_message' }, (payload) => {
        // In a real implementation, we would validate and add the message
        console.log('New message received:', payload);
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send messages.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Create new message object
    const messageData = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender_id: user.id,
      sender_name: user.email || 'Anonymous',
      created_at: new Date().toISOString(),
    };
    
    try {
      // In a complete implementation, we would store the message in Supabase
      // and broadcast it to other users
      
      // For now, just add it to local state
      setMessages(prev => [...prev, messageData]);
      setNewMessage("");
      
      // In a real implementation, we would broadcast the message to other users
      const channel = supabase.channel('studio_chat');
      await channel.send({
        type: 'broadcast',
        event: 'new_message',
        payload: messageData,
      });
      
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Failed to send message",
        description: "Your message couldn't be sent. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 p-2">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-3 ${message.sender_id === user?.id ? 'ml-auto' : ''}`}
          >
            <div className={`max-w-[80%] ${message.sender_id === user?.id ? 'ml-auto' : ''}`}>
              {message.sender_id !== user?.id && (
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 rounded-full bg-cyber-purple/30 flex items-center justify-center mr-2">
                    <UserIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs text-white/70">{message.sender_name}</span>
                </div>
              )}
              <div 
                className={`p-3 rounded-lg ${
                  message.sender_id === user?.id 
                    ? 'bg-cyber-purple/30 rounded-tr-none' 
                    : 'bg-cyber-darker rounded-tl-none'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs text-right mt-1 text-white/50">
                  {formatTime(message.created_at)}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex items-end">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 resize-none bg-cyber-darker border-cyber-purple/20 focus-visible:ring-cyber-purple/30"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button
          onClick={handleSendMessage}
          className="ml-2 bg-cyber-purple hover:bg-cyber-purple/80"
          disabled={isLoading || !newMessage.trim()}
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </div>
      
      {!user && (
        <p className="text-xs text-center mt-2 text-white/50">
          Sign in to participate in chat
        </p>
      )}
    </div>
  );
};

export default Chat;
