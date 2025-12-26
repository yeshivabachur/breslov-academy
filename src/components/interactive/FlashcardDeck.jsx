import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlashcardDeck({ cards }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);

  const mockCards = cards || [
    { front: 'What does "Simcha" mean?', back: 'Joy / Happiness' },
    { front: 'What is "Hitbodedut"?', back: 'Personal prayer and meditation' },
    { front: 'Who wrote Likutey Moharan?', back: 'Rebbe Nachman of Breslov' },
  ];

  const handleNext = () => {
    if (currentIndex < mockCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };

  const handleKnown = (isKnown) => {
    setKnown([...known, { index: currentIndex, known: isKnown }]);
    handleNext();
  };

  const card = mockCards[currentIndex];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-slate-600">
          Card {currentIndex + 1} of {mockCards.length}
        </span>
        <Button
          onClick={() => { setCurrentIndex(0); setFlipped(false); setKnown([]); }}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="perspective-1000">
        <motion.div
          onClick={() => setFlipped(!flipped)}
          whileHover={{ scale: 1.02 }}
          className="relative h-80 cursor-pointer"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={flipped ? 'back' : 'front'}
              initial={{ rotateY: flipped ? -180 : 0, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: flipped ? 180 : -180, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Card className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-blue-500 to-purple-600 border-0 premium-shadow-xl rounded-[2rem]">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-4">
                    {flipped ? card.back : card.front}
                  </p>
                  <p className="text-sm text-white/70">
                    {flipped ? 'Click to see question' : 'Click to reveal answer'}
                  </p>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          className="flex-1 rounded-2xl"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        
        {flipped && (
          <>
            <Button
              onClick={() => handleKnown(false)}
              variant="outline"
              className="flex-1 rounded-2xl border-red-300 text-red-600 hover:bg-red-50"
            >
              <X className="w-5 h-5 mr-2" />
              Review
            </Button>
            <Button
              onClick={() => handleKnown(true)}
              variant="outline"
              className="flex-1 rounded-2xl border-green-300 text-green-600 hover:bg-green-50"
            >
              <Check className="w-5 h-5 mr-2" />
              Know It
            </Button>
          </>
        )}

        <Button
          onClick={handleNext}
          disabled={currentIndex === mockCards.length - 1}
          className="flex-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Progress</span>
          <span className="font-bold text-slate-900">
            {known.length} / {mockCards.length}
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(known.length / mockCards.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          />
        </div>
      </div>
    </div>
  );
}