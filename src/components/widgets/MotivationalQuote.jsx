import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(null);

  const quotes = [
    { text: 'Never give up! There is no such thing as despair.', source: 'Rebbe Nachman', hebrew: 'אין שום יאוש בעולם כלל' },
    { text: 'The entire world is a very narrow bridge, and the main thing is not to be afraid.', source: 'Likutey Moharan', hebrew: 'כל העולם כולו גשר צר מאוד' },
    { text: 'Always look at the good points in yourself and others.', source: 'Azamra Teaching', hebrew: 'תמיד חפש את הנקודות טובות' },
    { text: 'Through joy, one can achieve the highest levels.', source: 'Likutey Moharan', hebrew: 'על ידי שמחה אפשר להגיע למדרגות עליונות' },
    { text: 'Prayer is the ultimate wisdom.', source: 'Likutey Moharan I:9', hebrew: 'תפילה היא החכמה העליונה' }
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const refreshQuote = () => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  if (!quote) return null;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Sparkles className="w-6 h-6 text-amber-600" />
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshQuote}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <motion.div
          key={quote.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <p className="text-xl font-serif text-slate-800 leading-relaxed">
            "{quote.text}"
          </p>
          <div className="text-lg text-amber-700 font-serif" dir="rtl">
            "{quote.hebrew}"
          </div>
          <div className="text-sm text-slate-600 font-semibold">
            — {quote.source}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}