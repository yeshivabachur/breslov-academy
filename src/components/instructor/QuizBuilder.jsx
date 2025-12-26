import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizBuilder({ courseId, onSave }) {
  const [quiz, setQuiz] = useState({
    title: '',
    passing_score: 70,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question_text: '',
    options: ['', '', '', ''],
    correct_option: 0
  });

  const addQuestion = () => {
    if (currentQuestion.question_text && currentQuestion.options[0]) {
      setQuiz({
        ...quiz,
        questions: [...quiz.questions, currentQuestion]
      });
      setCurrentQuestion({
        question_text: '',
        options: ['', '', '', ''],
        correct_option: 0
      });
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          Quiz Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Quiz Title</label>
          <Input
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            placeholder="Lesson 1 Quiz"
            className="rounded-xl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Passing Score (%)</label>
          <Input
            type="number"
            value={quiz.passing_score}
            onChange={(e) => setQuiz({ ...quiz, passing_score: parseInt(e.target.value) })}
            placeholder="70"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h4 className="font-bold text-slate-900">Add Question</h4>
          
          <Input
            value={currentQuestion.question_text}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
            placeholder="What is simcha?"
            className="rounded-xl"
          />

          <div className="space-y-2">
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...currentQuestion.options];
                    newOptions[idx] = e.target.value;
                    setCurrentQuestion({ ...currentQuestion, options: newOptions });
                  }}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 rounded-xl"
                />
                <Button
                  onClick={() => setCurrentQuestion({ ...currentQuestion, correct_option: idx })}
                  variant={currentQuestion.correct_option === idx ? 'default' : 'outline'}
                  className="rounded-xl"
                >
                  ✓
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={addQuestion} variant="outline" className="w-full rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {/* Questions List */}
        {quiz.questions.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <h4 className="font-bold text-slate-900">Questions ({quiz.questions.length})</h4>
            <AnimatePresence>
              {quiz.questions.map((q, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-3 bg-white rounded-xl"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 text-sm">{q.question_text}</div>
                      <div className="text-xs text-green-600 mt-1">✓ {q.options[q.correct_option]}</div>
                    </div>
                    <Button
                      onClick={() => setQuiz({ ...quiz, questions: quiz.questions.filter((_, i) => i !== idx) })}
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <Button
          onClick={() => onSave?.(quiz)}
          disabled={!quiz.title || quiz.questions.length === 0}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-2xl"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Quiz
        </Button>
      </CardContent>
    </Card>
  );
}