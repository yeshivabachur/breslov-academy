import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LiveChat({ roomId }) {
  const [messages, setMessages] = useState([
    { user: 'Moshe', text: 'Great shiur!', time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, {
        user: 'You',
        text: input,
        time: new Date(),
        isOwn: true
      }]);
      setInput('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem] h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-serif">Live Chat</span>
          </div>
          <Badge className="bg-green-100 text-green-800">
            {messages.length} messages
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                msg.isOwn 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-slate-200 text-slate-900'
              }`}>
                {!msg.isOwn && (
                  <div className="text-xs font-bold mb-1">{msg.user}</div>
                )}
                <div className="text-sm">{msg.text}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type message..."
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