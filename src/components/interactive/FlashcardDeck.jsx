import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function FlashcardDeck({ cards }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const deck = cards || [
    { front: 'שלום', back: 'Peace/Hello' },
    { front: 'תורה', back: 'Torah' },
    { front: 'חכמה', back: 'Wisdom' }
  ];

  const card = deck[currentCard];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Badge className="bg-blue-100 text-blue-800">
            {currentCard + 1} / {deck.length}
          </Badge>
          <Button
            onClick={() => setIsFlipped(false)}
            variant="outline"
            size="sm"
            className="rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <motion.div
          onClick={() => setIsFlipped(!isFlipped)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          className="h-64 cursor-pointer"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 backface-hidden">
            <div className="h-full bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center p-8">
              <div className="text-6xl font-black text-white" dir="rtl">
                {card.front}
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
            <div className="h-full bg-white border-2 border-blue-300 rounded-2xl flex items-center justify-center p-8">
              <div className="text-4xl font-bold text-slate-900">
                {card.back}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center justify-between">
          <Button
            onClick={() => setCurrentCard(Math.max(0, currentCard - 1))}
            disabled={currentCard === 0}
            variant="outline"
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="text-sm text-slate-600">
            {isFlipped ? 'Front side' : 'Click to flip'}
          </div>

          <Button
            onClick={() => setCurrentCard(Math.min(deck.length - 1, currentCard + 1))}
            disabled={currentCard === deck.length - 1}
            variant="outline"
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}