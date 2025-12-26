import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Share2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  {
    text: "It is a great mitzvah to always be happy.",
    source: "Likutey Moharan II:24",
    hebrew: "מצוה גדולה להיות בשמחה תמיד"
  },
  {
    text: "All the world is a very narrow bridge, but the essential thing is not to fear at all.",
    source: "Likutey Moharan II:48",
    hebrew: "כל העולם כולו גשר צר מאוד והעיקר לא לפחד כלל"
  },
  {
    text: "If you believe that you can damage, then believe that you can fix.",
    source: "Likutey Moharan II:112",
    hebrew: "אם אתה מאמין שיכולים לקלקל, תאמין שיכולים לתקן"
  },
  {
    text: "The whole world was created for my sake.",
    source: "Sanhedrin 37a",
    hebrew: "בשבילי נברא העולם"
  },
  {
    text: "Prayer is the highest form of wisdom.",
    source: "Likutey Moharan I:9",
    hebrew: "התפילה היא החכמה העליונה"
  },
];

export default function DailyQuote() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [liked, setLiked] = useState(false);

  const refreshQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
    setLiked(false);
  };

  return (
    <Card className="relative overflow-hidden border-0 premium-shadow-xl rounded-[2rem]">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-blue-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200 rounded-full blur-[120px] opacity-30" />
      
      <CardContent className="relative p-8 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <blockquote className="space-y-4">
              <p className="text-2xl md:text-3xl font-serif text-slate-800 leading-relaxed">
                "{currentQuote.text}"
              </p>
              <div className="text-center" dir="rtl">
                <p className="text-xl text-amber-700 font-bold mb-2">
                  {currentQuote.hebrew}
                </p>
              </div>
              <footer className="flex items-center justify-between pt-4">
                <cite className="text-slate-600 font-semibold not-italic">
                  — {currentQuote.source}
                </cite>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setLiked(!liked)}
                    variant="ghost"
                    size="icon"
                    className={`rounded-full transition-colors ${liked ? 'text-red-500' : 'text-slate-400'}`}
                  >
                    <Heart className="w-5 h-5" fill={liked ? "currentColor" : "none"} />
                  </Button>
                  <Button
                    onClick={refreshQuote}
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </footer>
            </blockquote>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}