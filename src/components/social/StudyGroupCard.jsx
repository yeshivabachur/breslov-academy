import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudyGroupCard({ group }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }}>
      <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all rounded-[2rem] overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="w-16 h-16 text-white/30" />
          </div>
        </div>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {group?.name || 'Torah Study Circle'}
            </h3>
            <p className="text-slate-600 text-sm line-clamp-2">
              {group?.description || 'Join us for daily Gemara study and deep discussions on Jewish philosophy'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-100 text-blue-800">
              <Users className="w-3 h-3 mr-1" />
              {group?.members || 12} members
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              <Clock className="w-3 h-3 mr-1" />
              {group?.schedule || 'Daily 8 PM'}
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              <BookOpen className="w-3 h-3 mr-1" />
              {group?.topic || 'Talmud'}
            </Badge>
          </div>

          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl btn-premium group">
            <span className="flex items-center justify-center gap-2">
              Join Group
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}