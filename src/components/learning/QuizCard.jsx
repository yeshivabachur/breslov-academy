import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Award, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function QuizCard({ quiz, user, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());

  const questions = quiz.questions || [];
  const question = questions[currentQuestion];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    const attemptAnswers = [];

    questions.forEach((q, idx) => {
      const userAnswer = answers[idx];
      const isCorrect = userAnswer === q.correct_answer;
      if (isCorrect) correctCount++;
      
      attemptAnswers.push({
        question_index: idx,
        answer: userAnswer || '',
        is_correct: isCorrect
      });
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= (quiz.passing_score || 70);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    setScore(scorePercentage);
    setShowResults(true);

    await base44.entities.QuizAttempt.create({
      quiz_id: quiz.id,
      user_email: user.email,
      score: scorePercentage,
      answers: attemptAnswers,
      passed,
      time_taken_seconds: timeTaken,
      completed_at: new Date().toISOString()
    });

    if (passed) {
      toast.success('Congratulations! You passed the quiz!');
      onComplete?.();
    } else {
      toast.error('You can try again to improve your score');
    }
  };

  if (showResults) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardHeader className="text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            score >= (quiz.passing_score || 70) ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            {score >= (quiz.passing_score || 70) ? (
              <Award className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-orange-600" />
            )}
          </div>
          <CardTitle className="text-3xl font-bold">
            {score >= (quiz.passing_score || 70) ? 'Quiz Passed!' : 'Keep Practicing'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-5xl font-bold text-slate-900">{score}%</div>
          <p className="text-slate-600">
            You got {Math.round((score / 100) * questions.length)} out of {questions.length} correct
          </p>
          <p className="text-sm text-slate-500">
            Passing score: {quiz.passing_score || 70}%
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-slate-600">No questions available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            <span>{Math.round((Date.now() - startTime) / 1000)}s</span>
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
        <CardTitle className="text-xl">{question.question}</CardTitle>
        {question.question_hebrew && (
          <p className="text-amber-700 mt-2" dir="rtl">{question.question_hebrew}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={answers[currentQuestion]} onValueChange={handleAnswer}>
          <div className="space-y-3">
            {question.options?.map((option, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value={option} id={`option-${idx}`} />
                <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}