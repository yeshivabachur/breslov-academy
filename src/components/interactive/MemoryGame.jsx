import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, RotateCcw, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const hebrewPairs = [
    { id: 1, hebrew: 'שלום', english: 'Peace' },
    { id: 2, hebrew: 'תורה', english: 'Torah' },
    { id: 3, hebrew: 'חכמה', english: 'Wisdom' },
    { id: 4, hebrew: 'אמונה', english: 'Faith' },
    { id: 5, hebrew: 'שמחה', english: 'Joy' },
    { id: 6, hebrew: 'חסד', english: 'Kindness' }
  ];

  const initGame = () => {
    const gameCards = [];
    hebrewPairs.forEach(pair => {
      gameCards.push({ ...pair, side: 'hebrew', uniqueId: `${pair.id}-h` });
      gameCards.push({ ...pair, side: 'english', uniqueId: `${pair.id}-e` });
    });
    
    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (card) => {
    if (flipped.length === 2 || matched.includes(card.id)) return;
    
    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      
      if (newFlipped[0].id === newFlipped[1].id) {
        setMatched([...matched, card.id]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const isFlipped = (card) => flipped.some(f => f.uniqueId === card.uniqueId) || matched.includes(card.id);

  return (
    <Card className="glass-effect border-0 premium-shadow-xl rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <Brain className="w-5 h-5 text-purple-600" />
            <div>Memory Match</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">{moves} moves</Badge>
            <Button variant="ghost" size="sm" onClick={initGame}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card, idx) => (
            <motion.div
              key={card.uniqueId}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleCardClick(card)}
              className={`aspect-square rounded-xl cursor-pointer ${
                isFlipped(card)
                  ? matched.includes(card.id)
                    ? 'bg-gradient-to-br from-green-400 to-emerald-600'
                    : 'bg-gradient-to-br from-blue-400 to-indigo-600'
                  : 'bg-gradient-to-br from-slate-300 to-slate-400'
              } flex items-center justify-center text-white font-bold shadow-lg`}
            >
              {isFlipped(card) ? (
                <div className="text-center p-2">
                  <div className={card.side === 'hebrew' ? 'text-xl' : 'text-sm'}>
                    {card.side === 'hebrew' ? card.hebrew : card.english}
                  </div>
                </div>
              ) : (
                <div className="text-3xl">?</div>
              )}
            </motion.div>
          ))}
        </div>

        {matched.length === hebrewPairs.length && (
          <div className="mt-6 p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-300 text-center">
            <Award className="w-12 h-12 text-amber-600 mx-auto mb-3" />
            <div className="text-2xl font-black text-slate-900 mb-2">Perfect Match!</div>
            <div className="text-amber-800">Completed in {moves} moves • +100 XP</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}