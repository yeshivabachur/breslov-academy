import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Users, Paperclip } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function StudyBuddyChat({ buddyName = 'Study Partner' }) {
  const [messages, setMessages] = useState([
    {
      from: buddyName,
      text: 'Hey! Ready to review Likutey Moharan Torah 1?',
      time: new Date(Date.now() - 300000),
      isOwn: false
    },
    {
      from: 'You',
      text: 'Yes! I have questions about the Azamra concept',
      time: new Date(Date.now() - 180000),
      isOwn: true
    },
    {
      from: buddyName,
      text: 'Great! Let\'s start with the basic principle...',
      time: new Date(Date.now() - 60000),
      isOwn: false
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        from: 'You',
        text: newMessage,
        time: new Date(),
        isOwn: true
      }]);
      setNewMessage('');
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem] h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <div>Study Buddy</div>
              <div className="text-sm text-slate-600 font-normal">{buddyName}</div>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            Online
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] ${msg.isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                {!msg.isOwn && (
                  <div className="text-xs font-bold text-slate-600 mb-1">{msg.from}</div>
                )}
                <div className={`px-4 py-2 rounded-2xl ${
                  msg.isOwn 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' 
                    : 'bg-white border border-slate-200 text-slate-900'
                }`}>
                  {msg.text}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {msg.time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 bg-white/50">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Message your study buddy..."
              className="flex-1 rounded-xl"
            />
            <Button
              onClick={sendMessage}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}