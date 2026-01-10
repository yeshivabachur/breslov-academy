import { useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * useAITutor Hook
 * Manages the state and interactions for the AI Tutor chat interface.
 */
export function useAITutor(context = {}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Shalom! I am your AI study partner. How can I help you deepen your understanding of this lesson today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content) => {
    // Optimistic user message
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Mock API call - in production this would hit your RAG endpoint
      // const response = await base44.functions.invoke('ai-tutor-chat', { 
      //   message: content, 
      //   context 
      // });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `That's a great question about "${context.lessonTitle || 'the lesson'}". 

Rebbe Nachman teaches that we should look for the good points in everything. Specifically regarding your question, the text implies that... [Mock AI Response]`,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('AI Tutor Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [context]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Shalom! Chat history cleared. What would you like to discuss?',
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat
  };
}
