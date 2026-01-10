import React, { useRef, useEffect } from 'react';
import { useAITutor } from '@/components/hooks/useAITutor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, Trash2, Sparkles } from 'lucide-react';
import { tokens, cx } from '@/components/theme/tokens';
import GlassCard from '@/components/ui/GlassCard';

export default function AITutorInterface({ context, className }) {
  const { messages, isTyping, sendMessage, clearChat } = useAITutor(context);
  const [input, setInput] = React.useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <GlassCard className={cx("flex flex-col h-[600px] w-full max-w-md mx-auto overflow-hidden border-2 border-primary/10", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-muted/20 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">AI Study Partner</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Online
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={clearChat} title="Clear Chat">
          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-background/50">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cx(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <Avatar className="w-8 h-8 border border-border">
                {msg.role === 'assistant' ? (
                  <AvatarFallback className="bg-indigo-100 text-indigo-600"><Bot className="w-4 h-4" /></AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-amber-100 text-amber-600"><User className="w-4 h-4" /></AvatarFallback>
                )}
              </Avatar>
              
              <div className={cx(
                "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                msg.role === 'user' 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-white dark:bg-slate-800 border border-border/50 rounded-tl-sm"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 max-w-[85%]">
              <Avatar className="w-8 h-8 border border-border">
                <AvatarFallback className="bg-indigo-100 text-indigo-600"><Bot className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div className="bg-white dark:bg-slate-800 border border-border/50 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="relative flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about this lesson..."
            className="pr-12 rounded-full border-primary/20 focus:border-primary/50 shadow-inner bg-background"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-1 w-8 h-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
            disabled={!input.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-[10px] text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI can make mistakes. Verify with your Rabbi.
        </div>
      </form>
    </GlassCard>
  );
}
