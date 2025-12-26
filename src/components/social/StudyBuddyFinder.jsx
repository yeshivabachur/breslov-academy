import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, Calendar, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudyBuddyFinder({ matches, onConnect, userEmail }) {
  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Find a Study Buddy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-slate-600 text-sm">
          Connect with fellow students who share your interests and learning goals
        </p>

        <div className="space-y-3">
          {matches?.map((match, idx) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="p-4 bg-white rounded-xl hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {match.name?.[0] || 'S'}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900">{match.name}</h4>
                      <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {match.compatibility_score}% match
                      </Badge>
                    </div>

                    <div className="text-sm text-slate-600 mb-2">
                      Currently studying: {match.current_courses?.join(', ')}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {match.interests?.map((interest, i) => (
                        <Badge key={i} variant="outline">{interest}</Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => onConnect?.(match.id)}
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {(!matches || matches.length === 0) && (
            <div className="text-center py-8 text-slate-500">
              No study buddy matches found yet. Complete more courses to find compatible partners!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}