import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Clock, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComprehensiveAssessment({ assessment, onSubmit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(assessment?.time_limit_minutes * 60);

  const questions = assessment?.questions || [];
  const question = questions[currentQuestion];

  React.useEffect(() => {
    if (!assessment?.time_limit_minutes) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onSubmit?.(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestion = () => {
    switch(question?.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setAnswers({ ...answers, [currentQuestion]: idx })}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentQuestion] === idx
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === idx
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300'
                  }`}>
                    {answers[currentQuestion] === idx && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-slate-900 font-serif">{option}</span>
                </div>
              </button>
            ))}
          </div>
        );

      case 'true_false':
        return (
          <div className="grid grid-cols-2 gap-4">
            {['True', 'False'].map((option, idx) => (
              <button
                key={idx}
                onClick={() => setAnswers({ ...answers, [currentQuestion]: idx === 0 })}
                className={`p-6 rounded-xl border-2 text-center transition-all ${
                  answers[currentQuestion] === (idx === 0)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="text-2xl font-black text-slate-900 font-serif">{option}</div>
              </button>
            ))}
          </div>
        );

      case 'essay':
        return (
          <Textarea
            value={answers[currentQuestion] || ''}
            onChange={(e) => setAnswers({ ...answers, [currentQuestion]: e.target.value })}
            placeholder="Write your response in detail..."
            className="min-h-[300px] rounded-xl font-serif"
          />
        );

      case 'fill_blank':
        return (
          <div className="space-y-4">
            <div className="p-6 bg-slate-50 rounded-xl">
              <p className="text-lg text-slate-900 font-serif leading-relaxed">
                {question.text_before}
                <Input
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentQuestion]: e.target.value })}
                  className="inline-flex w-48 mx-2 font-serif"
                  placeholder="___"
                />
                {question.text_after}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem] max-w-4xl mx-auto">
      <CardContent className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-serif mb-2">
              {assessment?.title}
            </h2>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Badge variant="outline">{questions.length} questions</Badge>
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {assessment?.time_limit_minutes} minutes
              </Badge>
            </div>
          </div>

          {assessment?.time_limit_minutes && (
            <div className="text-center">
              <div className={`text-3xl font-black ${
                timeRemaining < 300 ? 'text-red-600' : 'text-slate-900'
              }`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-slate-600">Remaining</div>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Object.keys(answers).length} answered</span>
          </div>
          <Progress value={(currentQuestion / questions.length) * 100} className="h-2" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              {question?.points && (
                <Badge className="bg-amber-100 text-amber-800 mb-3">
                  {question.points} points
                </Badge>
              )}
              <h3 className="text-2xl font-bold text-slate-900 font-serif mb-4">
                {question?.question_text}
              </h3>
              {question?.question_hebrew && (
                <div className="text-xl text-blue-900 font-serif mb-4" dir="rtl">
                  {question.question_hebrew}
                </div>
              )}
            </div>

            {renderQuestion()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <Button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            variant="outline"
            className="rounded-xl font-serif"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={() => onSubmit?.(answers)}
              className="bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-xl font-serif px-8"
            >
              <Award className="w-4 h-4 mr-2" />
              Submit Assessment
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-xl font-serif"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}