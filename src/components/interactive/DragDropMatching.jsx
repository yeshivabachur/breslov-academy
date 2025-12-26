import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Award } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function DragDropMatching() {
  const [matches, setMatches] = useState({});
  
  const hebrewWords = [
    { id: 'h1', word: 'שלום', meaning: 'Peace' },
    { id: 'h2', word: 'תורה', meaning: 'Torah' },
    { id: 'h3', word: 'חכמה', meaning: 'Wisdom' },
    { id: 'h4', word: 'אמונה', meaning: 'Faith' }
  ];

  const englishWords = ['Peace', 'Torah', 'Wisdom', 'Faith'].sort(() => Math.random() - 0.5);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const hebrew = result.draggableId;
    const english = result.destination.droppableId;
    
    setMatches({ ...matches, [hebrew]: english });
  };

  const checkAnswers = () => {
    let correct = 0;
    hebrewWords.forEach(word => {
      if (matches[word.id] === word.meaning) correct++;
    });
    return correct;
  };

  const score = checkAnswers();
  const isComplete = Object.keys(matches).length === hebrewWords.length;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Badge className="bg-purple-100 text-purple-800">Drag & Match</Badge>
          {isComplete && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              {score} / {hebrewWords.length}
            </Badge>
          )}
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-sm font-bold text-slate-700">Hebrew Words</div>
              {hebrewWords.map((word, idx) => (
                <Draggable key={word.id} draggableId={word.id} index={idx}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200 text-center font-bold text-2xl cursor-move"
                      dir="rtl"
                    >
                      {word.word}
                    </div>
                  )}
                </Draggable>
              ))}
            </div>

            <div className="space-y-3">
              <div className="text-sm font-bold text-slate-700">English Meanings</div>
              {englishWords.map((meaning, idx) => (
                <Droppable key={meaning} droppableId={meaning}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="p-4 bg-white rounded-xl border-2 border-dashed border-slate-300 text-center min-h-[60px] flex items-center justify-center"
                    >
                      {meaning}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </DragDropContext>

        {isComplete && score === hebrewWords.length && (
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-300 text-center">
            <Award className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-black text-slate-900">Perfect Match!</div>
            <div className="text-green-800">+50 XP</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}