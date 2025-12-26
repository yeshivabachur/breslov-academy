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
    <div className="min-h-screen gradient-mesh bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-10">
        {/* Welcome Header - Oxford Inspired */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] premium-shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px]" />
          </div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
          
          <div className="relative p-8 md:p-14">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex-1">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-4 mb-4"
                >
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg animate-float">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
                    Shalom, {user?.full_name?.split(' ')[0] || 'Student'}
                  </h1>
                </motion.div>
                <p className="text-slate-200 text-xl md:text-2xl mb-8 font-light leading-relaxed">
                  Continue your scholarly journey through the wisdom of Rebbe Nachman of Breslov
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className="glass-effect rounded-2xl px-6 py-3.5 shadow-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl animate-glow">
                        <Flame className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-black text-xl">{studyStreak?.current_streak || 0}</div>
                        <div className="text-slate-300 text-xs font-medium">Day Streak</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className="glass-effect rounded-2xl px-6 py-3.5 shadow-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-black text-xl">{completedLessons}</div>
                        <div className="text-slate-300 text-xs font-medium">Lessons</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className={`glass-effect rounded-2xl px-6 py-3.5 shadow-xl bg-gradient-to-r ${currentLevelInfo.color}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-5 h-5 text-white animate-pulse" />
                      <div className="text-white font-black text-lg">{userLevel?.current_level || 'Initiate'}</div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Level Progress Card */}
              {currentLevelInfo.next && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="glass-effect rounded-3xl p-8 min-w-[320px] shadow-2xl"
                >
                  <div className="text-slate-200 text-sm mb-4 font-semibold uppercase tracking-wider">Next Rank</div>
                  <div className="text-white text-3xl font-black mb-6">{currentLevelInfo.next}</div>
                  <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-4 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNext}%` }}
                      transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${currentLevelInfo.color} shadow-lg`}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">{userLevel?.experience_points || 0} XP</span>
                    <span className="text-white font-bold">{currentLevelInfo.pointsNeeded} XP</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Daily Wisdom - Academic Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <Card className="relative overflow-hidden border-0 premium-shadow-lg rounded-[2rem]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-blue-50" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300 rounded-full blur-[100px] opacity-30 animate-pulse" />
            
            <CardHeader className="relative pb-6">
              <CardTitle className="text-3xl font-black text-slate-900 flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <span>Daily Wisdom</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative pb-8">
              <div className="border-l-4 border-amber-500 pl-10 py-6">
                <blockquote className="space-y-6">
                  <p className="text-slate-800 text-2xl md:text-4xl font-serif leading-[1.6] font-semibold">
                    "{todayWisdom.text}"
                  </p>
                  <footer className="flex items-center space-x-3 pt-4">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-amber-400 to-transparent rounded-full" />
                    <cite className="text-slate-700 font-bold text-lg not-italic">{todayWisdom.source}</cite>
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
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-1.5 w-16 bg-gradient-to-r from-amber-500 via-amber-400 to-transparent rounded-full" />
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">Torah Learning Paths</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -8 }}
            >
              <Link to={createPageUrl('TalmudStudy')}>
                <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all duration-500 group cursor-pointer h-full rounded-[2rem]">
                  <CardContent className="p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                      📖
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">Talmud</h3>
                    <p className="text-slate-600 font-medium mb-6">Gemara, Mishnah & Daf Yomi</p>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold shadow-lg">
                      Begin Study
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -8 }}
            >
              <Link to={createPageUrl('TorahStudy')}>
                <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all duration-500 group cursor-pointer h-full rounded-[2rem]">
                  <CardContent className="p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-3xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                      📜
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-green-600 transition-colors">Torah</h3>
                    <p className="text-slate-600 font-medium mb-6">Chumash, Parsha & Rashi</p>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold shadow-lg">
                      Begin Study
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ y: -8 }}
            >
              <Link to={createPageUrl('KabbalahStudy')}>
                <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all duration-500 group cursor-pointer h-full rounded-[2rem]">
                  <CardContent className="p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                      ✨
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">Kabbalah</h3>
                    <p className="text-slate-600 font-medium mb-6">Zohar & Mystical Wisdom</p>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold shadow-lg">
                      Begin Study
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ y: -8 }}
            >
              <Link to={createPageUrl('HalachaGuide')}>
                <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all duration-500 group cursor-pointer h-full rounded-[2rem]">
                  <CardContent className="p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-3xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                      ⚖️
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">Halacha</h3>
                    <p className="text-slate-600 font-medium mb-6">Jewish Law & Practice</p>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold shadow-lg">
                      Begin Study
                    </Button>
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