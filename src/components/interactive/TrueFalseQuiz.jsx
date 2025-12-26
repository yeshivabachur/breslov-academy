import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function TrueFalseQuiz({ questions, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);

  const sampleQuestions = questions || [
    { statement: 'Rebbe Nachman taught that joy is a great mitzvah', statementHebrew: 'רבי נחמן לימד ששמחה היא מצווה גדולה', answer: true },
    { statement: 'Azamra means to sing praises', statementHebrew: 'אזמרה פירושו לשיר שבחים', answer: false },
    { statement: 'Hitbodedut is personal prayer in solitude', statementHebrew: 'התבודדות היא תפילה אישית בהתבודדות', answer: true }
  ];

  const question = sampleQuestions[currentQ];

  const handleAnswer = (answer) => {
    if (answer === question.answer) {
      setScore(score + 1);
    }
    
    if (currentQ < sampleQuestions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 500);
    } else {
      setTimeout(() => onComplete?.(score), 1000);
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardContent className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Badge className="bg-blue-100 text-blue-800">
            Question {currentQ + 1} / {sampleQuestions.length}
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            Score: {score}
          </Badge>
        </div>

        <motion.div
          key={currentQ}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 bg-white rounded-2xl border-2 border-slate-200 text-center space-y-4"
        >
          <div className="text-2xl font-bold text-slate-900">
            {question.statement}
          </div>
          {question.statementHebrew && (
            <div className="text-xl text-amber-700 font-serif" dir="rtl">
              {question.statementHebrew}
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleAnswer(true)}
            size="lg"
            className="h-24 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl text-xl font-bold"
          >
            <CheckCircle className="w-8 h-8 mr-3" />
            True
          </Button>
          <Button
            onClick={() => handleAnswer(false)}
            size="lg"
            className="h-24 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl text-xl font-bold"
          >
            <XCircle className="w-8 h-8 mr-3" />
            False
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}