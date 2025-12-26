import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function QuizBuilder({ lessonId, onSave }) {
  const [quiz, setQuiz] = useState({
    title: '',
    passingScore: 70,
    questions: []
  });

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    questionHebrew: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: ''
  });

  const addQuestion = () => {
    if (newQuestion.question && newQuestion.correctAnswer) {
      setQuiz({
        ...quiz,
        questions: [...quiz.questions, { ...newQuestion }]
      });
      setNewQuestion({
        question: '',
        questionHebrew: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: ''
      });
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <FileText className="w-5 h-5 text-blue-600" />
          <div>
            <div>Quiz Builder</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">בניית מבחן</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Quiz Title</label>
          <Input
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            placeholder="e.g., Azamra Comprehension Quiz"
            className="rounded-xl"
          />
        </div>

        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm font-bold text-blue-900 mb-3">
            Add Question {quiz.questions.length + 1}
          </div>
          
          <div className="space-y-3">
            <Input
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              placeholder="Question in English"
              className="rounded-lg"
            />
            
            <Input
              value={newQuestion.questionHebrew}
              onChange={(e) => setNewQuestion({ ...newQuestion, questionHebrew: e.target.value })}
              placeholder="Question in Hebrew (optional)"
              className="rounded-lg"
              dir="rtl"
            />

            <div className="grid grid-cols-2 gap-2">
              {newQuestion.options.map((opt, idx) => (
                <Input
                  key={idx}
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...newQuestion.options];
                    newOptions[idx] = e.target.value;
                    setNewQuestion({ ...newQuestion, options: newOptions });
                  }}
                  placeholder={`Option ${idx + 1}`}
                  className="rounded-lg"
                />
              ))}
            </div>

            <Input
              value={newQuestion.correctAnswer}
              onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
              placeholder="Correct answer"
              className="rounded-lg"
            />

            <Button
              onClick={addQuestion}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-bold text-slate-700">
            Questions ({quiz.questions.length})
          </div>
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-start justify-between">
              <div className="flex-1">
                <div className="font-bold text-slate-900 text-sm">{idx + 1}. {q.question}</div>
                {q.questionHebrew && (
                  <div className="text-xs text-amber-700 font-serif" dir="rtl">{q.questionHebrew}</div>
                )}
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Trash2 className="w-3 h-3 text-red-500" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          onClick={() => onSave?.(quiz)}
          disabled={quiz.questions.length === 0}
          size="lg"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl"
        >
          Save Quiz
        </Button>
      </CardContent>
    </Card>
  );
}