import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function QuickQuiz({ question, onAnswer }) {
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);

  const sampleQuestion = question || {
    text: 'What does "Azamra" mean?',
    textHebrew: 'מה משמעות "אזמרה"?',
    options: [
      'I will sing',
      'I will judge favorably', 
      'I will learn',
      'I will pray'
    ],
    correct: 'I will judge favorably'
  };

  const handleAnswer = (answer) => {
    setSelected(answer);
    setAnswered(true);
    setTimeout(() => {
      onAnswer?.(answer === sampleQuestion.correct);
    }, 1500);
  };

  const isCorrect = selected === sampleQuestion.correct;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" />
          <Badge className="bg-purple-100 text-purple-800">Quick Quiz</Badge>
        </div>

        <div>
          <div className="text-lg font-bold text-slate-900 mb-2">
            {sampleQuestion.text}
          </div>
          <div className="text-md text-amber-700 font-serif" dir="rtl">
            {sampleQuestion.textHebrew}
          </div>
        </div>

        <div className="grid gap-2">
          {sampleQuestion.options.map((option, idx) => (
            <Button
              key={idx}
              onClick={() => !answered && handleAnswer(option)}
              disabled={answered}
              variant="outline"
              className={`w-full p-4 rounded-xl text-left justify-start ${
                answered
                  ? option === sampleQuestion.correct
                    ? 'bg-green-100 border-green-500 text-green-900'
                    : option === selected
                    ? 'bg-red-100 border-red-500 text-red-900'
                    : 'opacity-50'
                  : 'hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span>{option}</span>
                {answered && option === sampleQuestion.correct && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {answered && option === selected && option !== sampleQuestion.correct && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </Button>
          ))}
        </div>

        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`p-4 rounded-xl border ${
              isCorrect 
                ? 'bg-green-50 border-green-200' 
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className={`text-sm font-bold ${isCorrect ? 'text-green-900' : 'text-blue-900'}`}>
              {isCorrect ? '✅ Correct! +10 XP' : '💡 Keep learning!'}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}