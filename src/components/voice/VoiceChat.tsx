import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Mic, MicOff, User, Phone, PhoneOff } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface Participant {
  id: string;
  name: string;
  audioStream?: MediaStream;
  isMuted: boolean;
}

const VoiceChat = ({ projectId }: { projectId: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // Set up voice chat connection
  const startVoiceChat = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      
      // Set up audio processing
      const audioContext = new AudioContext();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 1.0;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      audioContextRef.current = audioContext;
      gainNodeRef.current = gainNode;
      
      // Join the voice chat room
      const channel = supabase.channel(`voice-${projectId}`);
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          console.log('Voice chat participants:', state);
          
          // Update participants list from presence state
          const newParticipants: Participant[] = [];
          Object.entries(state).forEach(([key, presences]: [string, any[]]) => {
            const presence = presences[0];
            if (presence.user_id !== user?.id) {
              newParticipants.push({
                id: presence.user_id,
                name: presence.user_name || 'Anonymous',
                isMuted: presence.is_muted,
              });
            }
          });
          setParticipants(newParticipants);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          const newUser = newPresences[0];
          
          if (newUser.user_id !== user?.id) {
            toast({
              title: "User joined voice chat",
              description: `${newUser.user_name || 'Someone'} has joined the voice chat.`,
            });
            
            // Establish WebRTC connection with the new user
            createPeerConnection(newUser.user_id, newUser.user_name);
          }
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          const leftUser = leftPresences[0];
          
          if (leftUser.user_id !== user?.id) {
            toast({
              title: "User left voice chat",
              description: `${leftUser.user_name || 'Someone'} has left the voice chat.`,
            });
            
            // Clean up connection for the user who left
            if (peerConnectionsRef.current[leftUser.user_id]) {
              peerConnectionsRef.current[leftUser.user_id].close();
              delete peerConnectionsRef.current[leftUser.user_id];
            }
            
            // Remove from participants list
            setParticipants(prev => prev.filter(p => p.id !== leftUser.user_id));
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED' && user) {
            await channel.track({
              user_id: user.id,
              user_name: user.email?.split('@')[0] || 'Anonymous',
              is_muted: false,
              joined_at: new Date().toISOString(),
            });
            setIsConnected(true);
            
            toast({
              title: "Voice chat connected",
              description: "You've joined the voice chat for this project.",
            });
          }
        });
      
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.error("Failed to start voice chat:", err);
      toast({
        title: "Voice Chat Error",
        description: "Could not access microphone. Please check browser permissions.",
        variant: "destructive"
      });
    }
  };
  
  // Create a new WebRTC peer connection with another user
  const createPeerConnection = (userId: string, userName: string) => {
    if (localStream) {
      // Create a new RTCPeerConnection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      });
      
      // Add local stream tracks to the connection
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
      
      // Set up event handlers for the connection
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // In a real implementation, you would send this candidate to the other peer
          // via your signaling server (Supabase or another WebSocket server)
          console.log("ICE candidate:", event.candidate);
        }
      };
      
      peerConnection.ontrack = (event) => {
        // When we receive a remote track
        const [remoteStream] = event.streams;
        
        // Add the stream to the participant's data
        setParticipants(prev => 
          prev.map(p => 
            p.id === userId 
              ? { ...p, audioStream: remoteStream }
              : p
          )
        );
      };
      
      // Store the connection
      peerConnectionsRef.current[userId] = peerConnection;
      
      // In a complete implementation, you would:
      // 1. Create an offer
      // 2. Set the local description
      // 3. Send the offer to the other peer via signaling
      // 4. Receive their answer
      // 5. Set the remote description
      
      // For this simplified demo, we'll just log that we've created a connection
      console.log(`Created peer connection for ${userName}`);
      
      // Add to participants
      setParticipants(prev => {
        // Only add if not already in the list
        if (!prev.find(p => p.id === userId)) {
          return [...prev, { id: userId, name: userName, isMuted: false }];
        }
        return prev;
      });
    }
  };
  
  // End voice chat session
  const stopVoiceChat = () => {
    // Stop the local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // Close all peer connections
    Object.values(peerConnectionsRef.current).forEach(connection => {
      connection.close();
    });
    peerConnectionsRef.current = {};
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    // Clear participants
    setParticipants([]);
    setIsConnected(false);
    
    toast({
      title: "Voice chat disconnected",
      description: "You've left the voice chat.",
    });
  };
  
  // Toggle mute state
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      
      setIsMuted(!isMuted);
      
      // In a complete implementation, you would update your presence state
      // to let others know you're muted
    }
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      Object.values(peerConnectionsRef.current).forEach(connection => {
        connection.close();
      });
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Render audio elements for each participant
  useEffect(() => {
    participants.forEach(participant => {
      if (participant.audioStream) {
        const audioElement = document.getElementById(`audio-${participant.id}`) as HTMLAudioElement;
        if (audioElement && audioElement.srcObject !== participant.audioStream) {
          audioElement.srcObject = participant.audioStream;
          audioElement.play().catch(err => console.error("Failed to play audio:", err));
        }
      }
    });
  }, [participants]);
  
  return (
    <div className="p-4 bg-cyber-darker border border-cyber-purple/20 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Voice Chat</h3>
      
      <div className="flex flex-col space-y-4">
        {!isConnected ? (
          <Button
            onClick={startVoiceChat}
            className="bg-cyber-purple hover:bg-cyber-purple/80"
          >
            <Phone className="mr-2 h-4 w-4" />
            <span>Join Voice Chat</span>
          </Button>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  className={isMuted ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <span className="text-sm">{isMuted ? "Unmute" : "Mute"}</span>
              </div>
              
              <Button
                variant="outline"
                className="border-red-500/50 text-red-300 hover:bg-red-500/20"
                onClick={stopVoiceChat}
              >
                <PhoneOff className="mr-2 h-4 w-4" />
                <span>Leave</span>
              </Button>
            </div>
            
            <div className="border-t border-cyber-purple/10 pt-4">
              <h4 className="text-sm font-medium mb-2">Participants ({participants.length + 1})</h4>
              
              <div className="space-y-1">
                {/* Current user */}
                <div className="flex items-center justify-between p-2 rounded bg-cyber-purple/20">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-cyber-purple/40 flex items-center justify-center mr-2">
                      <User className="h-4 w-4" />
                    </div>
                    <span>{user?.email?.split('@')[0] || 'You'} (you)</span>
                  </div>
                  <div>
                    {isMuted ? <MicOff className="h-4 w-4 text-red-300" /> : <Mic className="h-4 w-4 text-green-300" />}
                  </div>
                </div>
                
                {/* Other participants */}
                {participants.map(participant => (
                  <div key={participant.id} className="flex items-center justify-between p-2 rounded bg-cyber-darker">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-cyber-blue/20 flex items-center justify-center mr-2">
                        <User className="h-4 w-4" />
                      </div>
                      <span>{participant.name}</span>
                      {/* Hidden audio element to play the remote stream */}
                      <audio id={`audio-${participant.id}`} autoPlay playsInline hidden />
                    </div>
                    <div>
                      {participant.isMuted ? (
                        <MicOff className="h-4 w-4 text-red-300" />
                      ) : (
                        <Mic className="h-4 w-4 text-green-300" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-cyber-purple/10 pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-settings">Voice Activity</Label>
                <Switch id="voice-settings" />
              </div>
              
              <div className="mt-3">
                <Label htmlFor="voice-volume" className="text-sm block mb-1">Volume</Label>
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4" />
                  <input 
                    type="range" 
                    id="voice-volume"
                    min="0" 
                    max="1" 
                    step="0.1" 
                    defaultValue="1"
                    className="w-full"
                    onChange={(e) => {
                      if (gainNodeRef.current) {
                        gainNodeRef.current.gain.value = parseFloat(e.target.value);
                      }
                    }} 
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceChat;
