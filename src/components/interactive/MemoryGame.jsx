import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RotateCcw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const cardPairs = ['🕯️', '📖', '✡️', '🙏', '⭐', '💫'];

  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    const shuffled = [...cardPairs, ...cardPairs]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const handleCardClick = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-pink-600" />
            Memory Match
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-slate-600">Moves: {moves}</div>
            <Button onClick={initGame} variant="ghost" size="icon" className="rounded-full">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {matched.length === cards.length && cards.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-4 p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-center"
          >
            <Trophy className="w-8 h-8 text-white mx-auto mb-2" />
            <div className="text-white font-bold">Completed in {moves} moves!</div>
          </motion.div>
        )}

        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
              className="aspect-square cursor-pointer"
            >
              <div className={`w-full h-full rounded-2xl flex items-center justify-center text-4xl font-bold transition-all ${
                flipped.includes(card.id) || matched.includes(card.id)
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                  : 'bg-gradient-to-br from-slate-300 to-slate-400'
              }`}>
                {(flipped.includes(card.id) || matched.includes(card.id)) && card.emoji}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}