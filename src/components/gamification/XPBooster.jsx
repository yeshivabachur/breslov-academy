import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Star, Flame, Shield, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

export default function XPBooster({ currentXP, onActivateBoost }) {
  const [activeBoosts, setActiveBoosts] = useState([]);

  const boosts = [
    {
      id: 'double_xp_1h',
      name: '2x XP Boost',
      nameHebrew: 'הכפלת נקודות',
      multiplier: 2,
      duration: 60,
      cost: 100,
      icon: Star,
      color: 'from-amber-400 to-yellow-600'
    },
    {
      id: 'triple_xp_30m',
      name: '3x XP Blast',
      nameHebrew: 'פיצוץ נקודות',
      multiplier: 3,
      duration: 30,
      cost: 200,
      icon: Zap,
      color: 'from-purple-400 to-pink-600'
    },
    {
      id: 'mega_boost',
      name: '5x Mega Boost',
      nameHebrew: 'בוסט ענק',
      multiplier: 5,
      duration: 15,
      cost: 500,
      icon: Flame,
      color: 'from-red-400 to-orange-600'
    }
  ];

  const activateBoost = (boost) => {
    setActiveBoosts([...activeBoosts, { ...boost, endsAt: Date.now() + boost.duration * 60000 }]);
    onActivateBoost?.(boost);
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" />
            <h3 className="font-black text-slate-900">XP Boosters</h3>
          </div>
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Star className="w-3 h-3" />
            {currentXP} pts
          </Badge>
        </div>

        {activeBoosts.length > 0 && (
          <div className="p-4 bg-green-50 rounded-xl border-2 border-green-300 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-green-900">
                  {activeBoosts[0].multiplier}x Boost Active!
                </div>
                <div className="text-sm text-green-700">
                  Earn {activeBoosts[0].multiplier}x XP on all activities
                </div>
              </div>
              <Flame className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        )}

        <div className="space-y-3">
          {boosts.map((boost, idx) => {
            const Icon = boost.icon;
            const canAfford = currentXP >= boost.cost;
            const isActive = activeBoosts.some(b => b.id === boost.id);
            
            return (
              <motion.div
                key={boost.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-xl border-2 ${
                  isActive 
                    ? 'bg-green-50 border-green-300' 
                    : canAfford
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${boost.color} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-bold text-slate-900 mb-1">{boost.name}</div>
                    <div className="text-xs text-amber-700 font-serif mb-2" dir="rtl">
                      {boost.nameHebrew}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {boost.multiplier}x XP
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {boost.duration} min
                      </Badge>
                    </div>
                    
                    <Button
                      onClick={() => activateBoost(boost)}
                      disabled={!canAfford || isActive}
                      size="sm"
                      className={`w-full rounded-xl ${
                        isActive 
                          ? 'bg-green-600 text-white' 
                          : `bg-gradient-to-r ${boost.color} text-white`
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Active
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          {boost.cost} pts
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="text-sm text-amber-900 font-serif">
            💡 Use boosters strategically before completing challenging lessons or quizzes!
          </div>
        </div>
      </CardContent>
    </Card>
  );
}