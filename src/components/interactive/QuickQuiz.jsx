import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickQuiz({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const mockQuestions = questions || [
    {
      question: "What is the main teaching of Likutey Moharan II:24?",
      options: [
        "The importance of prayer",
        "It is a great mitzvah to always be happy",
        "Torah study guidelines",
        "Shabbat observance"
      ],
      correct: 1
    }
  ];

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === mockQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < mockQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 2000);
  };

  const question = mockQuestions[currentQuestion];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            Quick Quiz
          </CardTitle>
          <div className="text-sm font-bold text-slate-600">
            {currentQuestion + 1} / {mockQuestions.length}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-slate-900 leading-tight">
              {question.question}
            </h3>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-2xl text-left font-medium transition-all ${
                    showResult
                      ? index === question.correct
                        ? 'bg-green-100 border-2 border-green-500 text-green-900'
                        : index === selectedAnswer
                        ? 'bg-red-100 border-2 border-red-500 text-red-900'
                        : 'bg-slate-100 text-slate-500'
                      : 'bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        {index === question.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : index === selectedAnswer ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : null}
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 font-medium">Score</span>
                <span className="text-2xl font-black text-slate-900">
                  {score} / {mockQuestions.length}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}