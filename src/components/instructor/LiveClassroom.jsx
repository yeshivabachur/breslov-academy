import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Video, Users, MessageCircle, Share2, Hand, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiveClassroom({ sessionId }) {
  const [isMuted, setIsMuted] = useState(false);
  const [raisedHands, setRaisedHands] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { user: 'Sarah', message: 'Great explanation!', time: '2m ago' },
    { user: 'David', message: 'Can you clarify that point?', time: '1m ago' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const participants = [
    { name: 'Sarah Cohen', status: 'active' },
    { name: 'David Levy', status: 'active' },
    { name: 'Rachel Klein', status: 'away' },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Main Video Area */}
      <Card className="md:col-span-2 glass-effect border-0 premium-shadow-lg rounded-[2rem] overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-slate-900 to-blue-900 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Video className="w-24 h-24 text-white/30" />
          </div>
          
          <Badge className="absolute top-4 left-4 bg-red-500 text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </Badge>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
            <Button
              onClick={() => setIsMuted(!isMuted)}
              className={`rounded-full ${isMuted ? 'bg-red-500' : 'bg-white/20'} backdrop-blur-sm`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            <Button className="rounded-full bg-white/20 backdrop-blur-sm">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Breslov Philosophy - Live Session</h3>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="w-4 h-4" />
            <span>{participants.length} participants</span>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Participants */}
        <Card className="glass-effect border-0 premium-shadow-lg rounded-2xl">
          <CardContent className="p-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm mb-3">Participants ({participants.length})</h4>
            {participants.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${p.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`} />
                  <span className="text-sm text-slate-900">{p.name}</span>
                </div>
                <Hand className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Chat */}
        <Card className="glass-effect border-0 premium-shadow-lg rounded-2xl h-[400px] flex flex-col">
          <CardContent className="flex-1 flex flex-col p-4 gap-3">
            <h4 className="font-bold text-slate-900 text-sm">Live Chat</h4>
            <div className="flex-1 overflow-y-auto space-y-2">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="p-2 bg-white rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-xs">{msg.user}</span>
                    <span className="text-xs text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-sm text-slate-700">{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Send a message..."
                className="flex-1 rounded-xl"
              />
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}