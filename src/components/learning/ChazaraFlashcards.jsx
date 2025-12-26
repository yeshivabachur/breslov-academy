import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Check, X, Brain, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChazaraFlashcards({ courseId, userEmail, onComplete }) {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ easy: 0, medium: 0, hard: 0 });

  useEffect(() => {
    // Spaced repetition algorithm - fetch cards due for review
    const loadCards = async () => {
      // In production, this would use SM-2 or similar algorithm
      const demoCards = [
        {
          id: 1,
          front: 'What does "Simcha" mean?',
          back: 'Joy, happiness - a central mitzvah in Breslov teachings',
          term_hebrew: 'שִׂמְחָה',
          difficulty: 'easy',
          nextReview: new Date()
        },
        {
          id: 2,
          front: 'Explain the concept of Hitbodedut',
          back: 'Personal meditation/prayer in solitude, a core practice taught by Rebbe Nachman to speak to Hashem in one\'s own words',
          term_hebrew: 'הִתְבּוֹדְדוּת',
          difficulty: 'medium',
          nextReview: new Date()
        },
        {
          id: 3,
          front: 'What is the main teaching of Likutei Moharan II:24?',
          back: 'Mitzvah Gedolah Lihiyot B\'Simcha Tamid - It is a great mitzvah to always be happy',
          term_hebrew: 'מצוה גדולה להיות בשמחה תמיד',
          difficulty: 'hard',
          nextReview: new Date()
        }
      ];
      setCards(demoCards);
    };
    
    loadCards();
  }, [courseId, userEmail]);

  const currentCard = cards[currentIndex];

  const handleResponse = (difficulty) => {
    setResults(prev => ({
      ...prev,
      [difficulty]: prev[difficulty] + 1
    }));

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    } else {
      onComplete?.(results);
    }
  };

  if (!currentCard) {
    return (
      <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
        <CardContent className="p-12 text-center">
          <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 font-serif">No cards due for review. Great job!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-serif">
            <RotateCcw className="w-5 h-5 text-purple-600" />
            Chazara - Spaced Repetition Review
          </CardTitle>
          <Badge variant="outline" className="font-serif">
            Card {currentIndex + 1} / {cards.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Flashcard */}
        <div className="perspective-1000">
          <motion.div
            className="relative h-80 cursor-pointer"
            onClick={() => setFlipped(!flipped)}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                {currentCard.term_hebrew && (
                  <div className="text-5xl text-amber-300 mb-6 font-serif" dir="rtl">
                    {currentCard.term_hebrew}
                  </div>
                )}
                <div className="text-2xl text-white font-serif leading-relaxed">
                  {currentCard.front}
                </div>
                <div className="mt-6 text-white/60 text-sm font-serif">
                  Click to reveal answer
                </div>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 backface-hidden"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="h-full bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 rounded-2xl p-8 flex items-center justify-center text-center">
                <div className="text-xl text-white font-serif leading-relaxed">
                  {currentCard.back}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Response Buttons */}
        <AnimatePresence>
          {flipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <p className="text-center text-sm text-slate-600 font-serif mb-4">
                How well did you know this?
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={() => handleResponse('hard')}
                  variant="outline"
                  className="py-6 rounded-xl border-2 border-red-200 hover:bg-red-50 hover:border-red-500 transition-all"
                >
                  <div className="text-center">
                    <X className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <div className="font-bold text-red-700 text-sm">Again</div>
                    <div className="text-xs text-slate-600">&lt; 1 min</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleResponse('medium')}
                  variant="outline"
                  className="py-6 rounded-xl border-2 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-500 transition-all"
                >
                  <div className="text-center">
                    <RotateCcw className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <div className="font-bold text-yellow-700 text-sm">Good</div>
                    <div className="text-xs text-slate-600">3 days</div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleResponse('easy')}
                  variant="outline"
                  className="py-6 rounded-xl border-2 border-green-200 hover:bg-green-50 hover:border-green-500 transition-all"
                >
                  <div className="text-center">
                    <Check className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="font-bold text-green-700 text-sm">Easy</div>
                    <div className="text-xs text-slate-600">7 days</div>
                  </div>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zman Achievements */}
        <div className="pt-6 border-t border-slate-200">
          <h4 className="font-bold text-slate-900 mb-4 font-serif">Study Time Achievements</h4>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement, idx) => {
              const Icon = achievement.icon;
              const progress = (achievement.progress / achievement.total) * 100;
              
              return (
                <div
                  key={achievement.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 text-center"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${achievement.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 mb-1">{achievement.name}</div>
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full bg-gradient-to-r ${achievement.color}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-600">{achievement.progress}/{achievement.total}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}