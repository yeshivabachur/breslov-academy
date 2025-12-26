import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Target, Plus, CheckCircle, Circle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudyGoals() {
  const [goals, setGoals] = useState([
    { id: 1, text: 'Complete Talmud Berachot', completed: false },
    { id: 2, text: 'Memorize 10 Mishnayot', completed: true },
    { id: 3, text: 'Study Zohar daily for 30 days', completed: false },
  ]);
  const [newGoal, setNewGoal] = useState('');

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, { id: Date.now(), text: newGoal, completed: false }]);
      setNewGoal('');
    }
  };

  const toggleGoal = (id) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-600" />
          Study Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            placeholder="Add a new goal..."
            className="flex-1 rounded-xl"
          />
          <Button
            onClick={addGoal}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-shadow group"
              >
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className="flex-shrink-0"
                >
                  {goal.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                <span className={`flex-1 ${goal.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {goal.text}
                </span>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Progress</span>
            <span className="font-bold text-slate-900">
              {goals.filter(g => g.completed).length} / {goals.length}
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(goals.filter(g => g.completed).length / goals.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-orange-500 to-red-600"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}