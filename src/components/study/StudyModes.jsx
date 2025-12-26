import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Brain, Edit, Trophy, Zap, BookOpen, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudyModes({ studySet, onComplete }) {
  const [mode, setMode] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const modes = [
    { id: 'learn', name: 'Learn', icon: Brain, color: 'from-blue-500 to-blue-600', desc: 'Review terms with feedback' },
    { id: 'write', name: 'Write', icon: Edit, color: 'from-green-500 to-green-600', desc: 'Type the correct answer' },
    { id: 'test', name: 'Test', icon: Trophy, color: 'from-red-500 to-red-600', desc: 'Timed assessment' },
    { id: 'match', name: 'Match', icon: Zap, color: 'from-purple-500 to-purple-600', desc: 'Speed matching game' }
  ];

  const cards = studySet?.cards || [];
  const currentCard = cards[currentIndex];

  if (!mode) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modes.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card 
                className="card-modern border-white/60 premium-shadow hover:premium-shadow-xl transition-all rounded-2xl cursor-pointer overflow-hidden"
                onClick={() => setMode(m.id)}
              >
                <div className={`h-2 bg-gradient-to-r ${m.color}`} />
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${m.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 font-serif mb-2">{m.name}</h3>
                  <p className="text-sm text-slate-600 font-serif">{m.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  }

  // WRITE MODE (Quizlet-style)
  if (mode === 'write') {
    return (
      <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-serif">
              Question {currentIndex + 1} / {cards.length}
            </Badge>
            <div className="text-sm text-slate-600">
              Score: {score.correct}/{score.total} ({score.total > 0 ? Math.round((score.correct/score.total)*100) : 0}%)
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl text-center min-h-[200px] flex items-center justify-center">
            <div>
              {currentCard?.term_hebrew && (
                <div className="text-4xl text-slate-900 mb-4 font-serif" dir="rtl">
                  {currentCard.term_hebrew}
                </div>
              )}
              <div className="text-2xl font-bold text-slate-900 font-serif">
                {currentCard?.question || currentCard?.front}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const correct = userAnswer.toLowerCase().trim() === currentCard.answer?.toLowerCase().trim();
                  setScore({ correct: score.correct + (correct ? 1 : 0), total: score.total + 1 });
                  setShowAnswer(true);
                  setTimeout(() => {
                    if (currentIndex < cards.length - 1) {
                      setCurrentIndex(currentIndex + 1);
                      setUserAnswer('');
                      setShowAnswer(false);
                    } else {
                      onComplete?.(score);
                    }
                  }, 1500);
                }
              }}
              placeholder="Type your answer..."
              className="text-lg p-6 rounded-xl font-serif"
              autoFocus
            />

            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl ${
                  userAnswer.toLowerCase().trim() === currentCard.answer?.toLowerCase().trim()
                    ? 'bg-green-50 border-2 border-green-500'
                    : 'bg-red-50 border-2 border-red-500'
                }`}
              >
                <div className="font-bold text-slate-900 font-serif mb-1">
                  Correct Answer: {currentCard.answer}
                </div>
                {currentCard.explanation && (
                  <div className="text-sm text-slate-600 font-serif">{currentCard.explanation}</div>
                )}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // MATCH MODE (Speed game)
  if (mode === 'match') {
    return (
      <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-black text-slate-900 font-serif mb-2">Match the Terms</h3>
            <p className="text-slate-600 font-serif">Click matching pairs as fast as you can</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left column - Hebrew terms */}
            <div className="space-y-3">
              {cards.slice(0, 6).map((card, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="w-full p-4 rounded-xl font-serif text-lg hover:bg-blue-50"
                  dir="rtl"
                >
                  {card.term_hebrew || card.front}
                </Button>
              ))}
            </div>

            {/* Right column - English definitions (shuffled) */}
            <div className="space-y-3">
              {[...cards].slice(0, 6).sort(() => Math.random() - 0.5).map((card, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="w-full p-4 rounded-xl font-serif hover:bg-green-50"
                >
                  {card.answer || card.back}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}