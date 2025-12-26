import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Scroll, Star, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Quests({ quests, userProgress, onAccept, onClaim }) {
  const getIcon = (type) => {
    switch(type) {
      case 'daily': return Star;
      case 'weekly': return Trophy;
      case 'epic': return Zap;
      default: return Scroll;
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'daily': return 'from-blue-500 to-blue-600';
      case 'weekly': return 'from-purple-500 to-purple-600';
      case 'epic': return 'from-amber-500 to-amber-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="space-y-4">
      {quests?.map((quest, idx) => {
        const Icon = getIcon(quest.quest_type);
        const colorClass = getColor(quest.quest_type);
        const userQuest = userProgress?.find(p => p.quest_id === quest.id);
        const progress = userQuest?.progress || 0;
        const isCompleted = progress >= 100;

        return (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center shrink-0`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-lg text-slate-900">{quest.title}</h3>
                        <Badge className={`${
                          quest.quest_type === 'daily' ? 'bg-blue-100 text-blue-800' :
                          quest.quest_type === 'weekly' ? 'bg-purple-100 text-purple-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {quest.quest_type}
                        </Badge>
                      </div>
                      <p className="text-slate-600 text-sm">{quest.description}</p>
                    </div>

                    {userQuest ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-bold text-slate-900">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        
                        {isCompleted && !userQuest.claimed && (
                          <Button
                            onClick={() => onClaim?.(quest.id)}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl"
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            Claim {quest.reward_xp} XP
                          </Button>
                        )}

                        {isCompleted && userQuest.claimed && (
                          <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-xl text-green-700 font-bold">
                            <Trophy className="w-5 h-5" />
                            Quest Completed!
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-600">
                          <Trophy className="w-4 h-4" />
                          <span className="font-bold">{quest.reward_xp} XP</span>
                        </div>
                        <Button
                          onClick={() => onAccept?.(quest.id)}
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
                        >
                          Accept Quest
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}