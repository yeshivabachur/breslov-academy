import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MatchGame({ pairs }) {
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);

  const defaultPairs = pairs || [
    { id: 1, term: 'שלום', definition: 'Peace' },
    { id: 2, term: 'תורה', definition: 'Torah' },
    { id: 3, term: 'חכמה', definition: 'Wisdom' }
  ];

  const allItems = [
    ...defaultPairs.map(p => ({ ...p, type: 'term' })),
    ...defaultPairs.map(p => ({ ...p, type: 'definition' }))
  ].sort(() => Math.random() - 0.5);

  const handleClick = (item) => {
    if (matched.includes(item.id)) return;
    
    if (selected.length === 0) {
      setSelected([item]);
    } else if (selected[0].id === item.id && selected[0].type !== item.type) {
      setMatched([...matched, item.id]);
      setSelected([]);
    } else {
      setSelected([]);
    }
  };

  const isComplete = matched.length === defaultPairs.length;

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-8 space-y-6">
        <Badge className="bg-blue-100 text-blue-800">Match the Pairs</Badge>

        <div className="grid grid-cols-2 gap-3">
          {allItems.map((item, idx) => {
            const isMatched = matched.includes(item.id);
            const isSelected = selected.some(s => s.id === item.id && s.type === item.type);
            
            return (
              <Button
                key={idx}
                onClick={() => handleClick(item)}
                disabled={isMatched}
                variant="outline"
                className={`p-6 rounded-xl text-lg font-bold h-auto ${
                  isMatched 
                    ? 'bg-green-100 border-green-500 text-green-900' 
                    : isSelected
                    ? 'bg-blue-100 border-blue-500 text-blue-900'
                    : ''
                }`}
              >
                <div className={item.type === 'term' ? 'font-serif' : ''} dir={item.type === 'term' ? 'rtl' : 'ltr'}>
                  {item.type === 'term' ? item.term : item.definition}
                </div>
              </Button>
            );
          })}
        </div>

        {isComplete && (
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-300 text-center">
            <Award className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-black text-slate-900">All Matched!</div>
            <div className="text-green-800">+75 XP</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}