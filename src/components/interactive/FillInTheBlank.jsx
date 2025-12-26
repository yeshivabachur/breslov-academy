import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function FillInTheBlank({ sentence, blanks, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [showHints, setShowHints] = useState(false);

  const sampleSentence = sentence || "The Rebbe taught that ___ is a great mitzvah to always be ___";
  const sampleBlanks = blanks || [
    { id: 1, answer: 'it', hint: 'pronoun' },
    { id: 2, answer: 'happy', hint: 'emotion' }
  ];

  const checkAnswers = () => {
    let correct = 0;
    sampleBlanks.forEach(blank => {
      if (answers[blank.id]?.toLowerCase().trim() === blank.answer.toLowerCase()) {
        correct++;
      }
    });
    return correct === sampleBlanks.length;
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-8 space-y-6">
        <Badge className="bg-purple-100 text-purple-800">Fill in the Blanks</Badge>

        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-xl text-slate-900 leading-relaxed">
            {sampleSentence.split('___').map((part, idx) => (
              <React.Fragment key={idx}>
                {part}
                {idx < sampleBlanks.length && (
                  <Input
                    value={answers[sampleBlanks[idx].id] || ''}
                    onChange={(e) => setAnswers({ ...answers, [sampleBlanks[idx].id]: e.target.value })}
                    className="inline-block w-32 mx-2 h-10 text-center font-bold"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowHints(!showHints)}
            className="flex-1 rounded-xl"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {showHints ? 'Hide' : 'Show'} Hints
          </Button>
          <Button
            onClick={() => {
              if (checkAnswers()) {
                onComplete?.(true);
              }
            }}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Check
          </Button>
        </div>

        {showHints && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="text-sm text-amber-900">
              {sampleBlanks.map((blank, idx) => (
                <div key={blank.id}>Blank {idx + 1}: {blank.hint}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}