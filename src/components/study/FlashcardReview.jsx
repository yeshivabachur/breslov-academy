import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Check, X, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlashcardReview({ cards = [], onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState([]);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleResponse = (correct) => {
    setResults([...results, { card: currentCard, correct }]);
    
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      onComplete?.(results);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      speechSynthesis.speak(utterance);
    }
  };

  if (!currentCard) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm font-bold text-slate-700">
          Card {currentIndex + 1} of {cards.length}
        </div>
        <div className="text-sm text-slate-600">
          {results.filter(r => r.correct).length} / {results.length} correct
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-effect border-0 premium-shadow-xl rounded-[2rem] min-h-[400px] cursor-pointer"
                  onClick={() => setIsFlipped(!isFlipped)}>
              <CardContent className="p-12 flex flex-col items-center justify-center h-full">
                {!isFlipped ? (
                  <>
                    <div className="text-7xl font-black text-slate-900 mb-4" dir="rtl">
                      {currentCard.front}
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        speak(currentCard.front);
                      }}
                      className="rounded-2xl"
                    >
                      <Volume2 className="w-5 h-5 mr-2" />
                      Listen
                    </Button>
                    <div className="text-slate-500 mt-8">Click to reveal</div>
                  </>
                ) : (
                  <>
                    <div className="text-5xl font-bold text-slate-900 mb-4">
                      {currentCard.back}
                    </div>
                    {currentCard.example && (
                      <div className="text-slate-600 italic text-center mt-4">
                        "{currentCard.example}"
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {isFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4"
        >
          <Button
            onClick={() => handleResponse(false)}
            variant="outline"
            size="lg"
            className="flex-1 rounded-2xl border-2 border-red-200 hover:bg-red-50"
          >
            <X className="w-5 h-5 mr-2 text-red-600" />
            Didn't Know
          </Button>
          <Button
            onClick={() => handleResponse(true)}
            size="lg"
            className="flex-1 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 text-white"
          >
            <Check className="w-5 h-5 mr-2" />
            Got It!
          </Button>
        </motion.div>
      )}
    </div>
  );
}