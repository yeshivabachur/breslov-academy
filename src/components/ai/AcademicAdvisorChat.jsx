import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Send, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function AcademicAdvisorChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Shalom! I\'m your Torah learning advisor. I can help you choose courses, set goals, and plan your study path. How can I assist you?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    'What should I learn next?',
    'Help me set goals',
    'Recommend a study plan',
    'How to improve retention?'
  ];

  const sendMessage = async (text) => {
    const userMsg = text || input;
    if (!userMsg.trim()) return;

    setMessages([...messages, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a Torah learning academic advisor for Breslov Academy. Student asks: ${userMsg}. Provide helpful, encouraging guidance.`
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
          <GraduationCap className="w-5 h-5 text-blue-600" />
          Academic Advisor
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
          {quickQuestions.map((q, idx) => (
            <Button
              key={idx}
              onClick={() => sendMessage(q)}
              variant="outline"
              size="sm"
              className="rounded-lg text-xs"
            >
              {q}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask for guidance..."
            className="flex-1 rounded-xl"
          />
          <Button
            onClick={() => sendMessage()}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}