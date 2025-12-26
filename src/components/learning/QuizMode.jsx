import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizMode({ questions = [], onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const question = questions[currentQ];
  const isCorrect = selectedAnswer === question?.correctAnswer;
  const progress = ((currentQ + 1) / questions.length) * 100;

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    setTimeout(() => {
      setAnswers([...answers, { question: question.text, answer, correct: answer === question.correctAnswer }]);
      
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        onComplete?.([...answers, { question: question.text, answer, correct: answer === question.correctAnswer }]);
      }
    }, 1500);
  };

  if (!question) return null;

  const score = answers.filter(a => a.correct).length;
  const totalAnswered = answers.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm font-bold text-slate-700">
          Question {currentQ + 1} of {questions.length}
        </div>
        <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
          <Award className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-bold text-blue-900">{score} / {totalAnswered}</span>
        </div>
      </div>

      <Progress value={progress} className="h-2" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="glass-effect border-0 premium-shadow-xl rounded-[2rem]">
            <CardContent className="p-8 space-y-6">
              <div className="text-2xl font-bold text-slate-900">
                {question.text}
              </div>
              {question.textHebrew && (
                <div className="text-xl text-amber-700 font-serif" dir="rtl">
                  {question.textHebrew}
                </div>
              )}

              <div className="grid gap-3">
                {question.options.map((option, idx) => (
                  <Button
                    key={idx}
                    onClick={() => !showFeedback && handleAnswer(option)}
                    disabled={showFeedback}
                    className={`w-full p-6 rounded-2xl text-left justify-start text-lg font-semibold transition-all ${
                      showFeedback
                        ? option === question.correctAnswer
                          ? 'bg-green-100 border-2 border-green-500 text-green-900'
                          : option === selectedAnswer
                          ? 'bg-red-100 border-2 border-red-500 text-red-900'
                          : 'bg-slate-100 text-slate-400'
                        : 'bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-300 text-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{option}</span>
                      {showFeedback && option === question.correctAnswer && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                      {showFeedback && option === selectedAnswer && option !== question.correctAnswer && (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              {showFeedback && question.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <div className="font-bold text-blue-900 mb-2">Explanation:</div>
                  <div className="text-blue-800">{question.explanation}</div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}