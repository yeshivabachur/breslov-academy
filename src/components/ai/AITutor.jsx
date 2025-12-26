import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Send, BookOpen, Lightbulb } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AITutor({ context }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Shalom! I\'m your AI Torah tutor. How can I help you learn today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = [
    'Explain Azamra simply',
    'What is Hitbodedut?',
    'Quiz me on this lesson',
    'Break down this concept'
  ];

  const sendMessage = async (text) => {
    const userMsg = text || input;
    if (!userMsg.trim()) return;

    setMessages([...messages, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a Breslov Torah study AI tutor. Context: ${context}. Student asks: ${userMsg}. Provide clear, educational response.`
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem] h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Tutor
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-6">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' 
                  : 'bg-white border border-slate-200 text-slate-900'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap mb-3">
          {suggestions.map((sug, idx) => (
            <Button
              key={idx}
              onClick={() => sendMessage(sug)}
              variant="outline"
              size="sm"
              className="rounded-lg text-xs"
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              {sug}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything..."
            className="flex-1 rounded-xl"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}