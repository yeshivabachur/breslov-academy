import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, CheckCircle, Clock, Crown, ArrowRight, Star, Flame, Trophy, Sparkles, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userTier, setUserTier] = useState('free');

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

  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const subs = await base44.entities.Subscription.filter({ user_email: user.email });
      return subs[0] || null;
    },
    enabled: !!user?.email
  });

  const { data: shiurim = [] } = useQuery({
    queryKey: ['shiurim'],
    queryFn: () => base44.entities.ShiurRecording.list('-created_date', 6)
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ['progress', user?.email],
    queryFn: () => base44.entities.UserProgress.filter({ user_email: user.email }),
    enabled: !!user?.email
  });

  const { data: studyStreak } = useQuery({
    queryKey: ['streak', user?.email],
    queryFn: async () => {
      const streaks = await base44.entities.StudyStreak.filter({ user_email: user.email });
      return streaks[0] || null;
    },
    enabled: !!user?.email
  });

  const { data: userLevel } = useQuery({
    queryKey: ['userLevel', user?.email],
    queryFn: async () => {
      const levels = await base44.entities.UserLevel.filter({ user_email: user.email });
      return levels[0] || { current_level: 'Initiate', experience_points: 0, lessons_completed: 0 };
    },
    enabled: !!user?.email
  });

  useEffect(() => {
    if (subscription?.tier) {
      setUserTier(subscription.tier);
    }
  }, [subscription]);

  const completedLessons = userProgress?.filter(p => p.completed).length || 0;

  const tierBenefits = {
    free: { name: 'Free', color: 'text-slate-600', icon: Star },
    premium: { name: 'Premium', color: 'text-blue-600', icon: Crown },
    elite: { name: 'Elite', color: 'text-amber-600', icon: Crown }
  };

  const currentTier = tierBenefits[userTier];

  const dailyWisdom = [
    {
      text: "It is a great mitzvah to always be happy.",
      source: "Likutey Moharan II:24"
    },
    {
      text: "All the world is a very narrow bridge, but the essential thing is not to fear at all.",
      source: "Likutey Moharan II:48"
    },
    {
      text: "If you believe that you can damage, then believe that you can fix.",
      source: "Likutey Moharan II:112"
    },
    {
      text: "The whole world was created for my sake, therefore I must constantly examine myself.",
      source: "Based on Likutey Moharan"
    },
    {
      text: "Prayer is the highest form of wisdom.",
      source: "Likutey Moharan I:9"
    }
  ];

  const todayWisdom = dailyWisdom[new Date().getDay() % dailyWisdom.length];

  const levelInfo = {
    Initiate: { next: 'Student', pointsNeeded: 100, color: 'from-slate-400 to-slate-500' },
    Student: { next: 'Scholar', pointsNeeded: 500, color: 'from-blue-400 to-blue-500' },
    Scholar: { next: 'Sage', pointsNeeded: 1500, color: 'from-purple-400 to-purple-500' },
    Sage: { next: 'Master', pointsNeeded: 3000, color: 'from-amber-400 to-amber-500' },
    Master: { next: null, pointsNeeded: null, color: 'from-amber-500 to-amber-600' }
  };

  const currentLevelInfo = levelInfo[userLevel?.current_level || 'Initiate'];
  const progressToNext = currentLevelInfo.pointsNeeded 
    ? ((userLevel?.experience_points || 0) / currentLevelInfo.pointsNeeded) * 100 
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Welcome Header - Oxford Inspired */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-95" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-10" />
          
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <GraduationCap className="w-8 h-8 text-amber-400" />
                  <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                    Shalom, {user?.full_name?.split(' ')[0] || 'Student'}
                  </h1>
                </div>
                <p className="text-slate-300 text-lg md:text-xl mb-6 font-light">
                  Continue your scholarly journey through the wisdom of Rebbe Nachman of Breslov
                </p>
                
                <div className="flex flex-wrap items-center gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="glass-card rounded-full px-5 py-2.5 border border-white/20"
                  >
                    <div className="flex items-center space-x-2">
                      <Flame className="w-5 h-5 text-amber-400" />
                      <span className="text-white font-semibold">{studyStreak?.current_streak || 0}</span>
                      <span className="text-slate-300 text-sm">Day Streak</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="glass-card rounded-full px-5 py-2.5 border border-white/20"
                  >
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <span className="text-white font-semibold">{completedLessons}</span>
                      <span className="text-slate-300 text-sm">Lessons</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className={`glass-card rounded-full px-5 py-2.5 border border-amber-400/30 bg-gradient-to-r ${currentLevelInfo.color}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="text-white font-bold">{userLevel?.current_level || 'Initiate'}</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Level Progress Card */}
              {currentLevelInfo.next && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card rounded-2xl p-6 border border-white/20 min-w-[300px]"
                >
                  <div className="text-slate-300 text-sm mb-3 font-medium">Next Rank: {currentLevelInfo.next}</div>
                  <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNext}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full bg-gradient-to-r ${currentLevelInfo.color}`}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{userLevel?.experience_points || 0} XP</span>
                    <span className="text-white font-semibold">{currentLevelInfo.pointsNeeded} XP</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Daily Wisdom - Academic Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-blue-50" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-20" />
            
            <CardHeader className="relative pb-4">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center space-x-3">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span>Daily Wisdom</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="border-l-4 border-amber-500 pl-8 py-4">
                <blockquote className="space-y-4">
                  <p className="text-slate-700 text-xl md:text-3xl font-serif leading-relaxed italic">
                    "{todayWisdom.text}"
                  </p>
                  <footer className="flex items-center space-x-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent" />
                    <cite className="text-slate-600 font-semibold not-italic">{todayWisdom.source}</cite>
                  </footer>
                </blockquote>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Jewish Learning Paths */}

        {/* Jewish Learning Paths */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-transparent rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Torah Learning Paths</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to={createPageUrl('TalmudStudy')}>
                <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
                      📖
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Talmud</h3>
                    <p className="text-slate-600 text-sm mb-4">Gemara, Mishnah & Daf Yomi</p>
                    <Button variant="outline" className="w-full">Study Now</Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to={createPageUrl('TorahStudy')}>
                <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
                      📜
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">Torah</h3>
                    <p className="text-slate-600 text-sm mb-4">Chumash, Parsha & Rashi</p>
                    <Button variant="outline" className="w-full">Study Now</Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to={createPageUrl('KabbalahStudy')}>
                <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
                      ✨
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">Kabbalah</h3>
                    <p className="text-slate-600 text-sm mb-4">Zohar & Mystical Wisdom</p>
                    <Button variant="outline" className="w-full">Study Now</Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to={createPageUrl('HalachaGuide')}>
                <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all group cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform">
                      ⚖️
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">Halacha</h3>
                    <p className="text-slate-600 text-sm mb-4">Jewish Law & Practice</p>
                    <Button variant="outline" className="w-full">Study Now</Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}