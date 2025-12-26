import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Flame, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';

export default function TalmudStudy() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, []);

  const { data: dafYomiProgress } = useQuery({
    queryKey: ['dafYomi', user?.email],
    queryFn: async () => {
      const progress = await base44.entities.DafYomiProgress.filter({ user_email: user.email });
      return progress[0] || null;
    },
    enabled: !!user?.email
  });

  const { data: masechtot = [] } = useQuery({
    queryKey: ['masechtot'],
    queryFn: () => base44.entities.TalmudMasechta.list()
  });

  const sdarim = [
    { name: 'Zeraim', icon: '🌾', color: 'from-green-500 to-green-600' },
    { name: 'Moed', icon: '🕯️', color: 'from-blue-500 to-blue-600' },
    { name: 'Nashim', icon: '💍', color: 'from-pink-500 to-pink-600' },
    { name: 'Nezikin', icon: '⚖️', color: 'from-purple-500 to-purple-600' },
    { name: 'Kodashim', icon: '🏛️', color: 'from-amber-500 to-amber-600' },
    { name: 'Taharot', icon: '💧', color: 'from-cyan-500 to-cyan-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Talmud Study</h1>
          </div>
          <p className="text-slate-300 text-lg">
            Explore the depths of Torah wisdom through systematic Gemara study
          </p>
        </motion.div>

        {/* Daf Yomi Progress */}
        {dafYomiProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <span>Daf Yomi Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <span className="text-slate-600 font-medium">Current Daf</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">
                      {dafYomiProgress.current_masechta} {dafYomiProgress.current_daf}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-slate-600 font-medium">Completed</span>
                    </div>
                    <p className="text-3xl font-bold text-green-900">
                      {dafYomiProgress.total_dapim_completed}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <Flame className="w-5 h-5 text-amber-600" />
                      <span className="text-slate-600 font-medium">Streak</span>
                    </div>
                    <p className="text-3xl font-bold text-amber-900">
                      {dafYomiProgress.current_streak} days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Six Orders */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Six Orders of Mishnah</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sdarim.map((seder, idx) => {
              const masechtoInSeder = masechtot.filter(m => m.seder === seder.name);
              
              return (
                <motion.div
                  key={seder.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                >
                  <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all group">
                    <CardHeader>
                      <div className={`w-16 h-16 bg-gradient-to-r ${seder.color} rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}>
                        {seder.icon}
                      </div>
                      <CardTitle className="text-2xl">Seder {seder.name}</CardTitle>
                      <p className="text-slate-600">{masechtoInSeder.length} Masechtot</p>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700">
                        Explore {seder.name}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}