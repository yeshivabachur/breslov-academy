import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Crown, BookOpen, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function KabbalahStudy() {
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

  const { data: zoharSections = [] } = useQuery({
    queryKey: ['zohar'],
    queryFn: () => base44.entities.ZoharSection.list('-created_date', 10)
  });

  const { data: kabbalahConcepts = [] } = useQuery({
    queryKey: ['kabbalah'],
    queryFn: () => base44.entities.KabbalahConcept.list()
  });

  const categories = [
    { name: 'Sefirot', desc: 'Divine Emanations', icon: '✨', color: 'from-purple-500 to-purple-600' },
    { name: 'Olamot', desc: 'Spiritual Worlds', icon: '🌌', color: 'from-blue-500 to-blue-600' },
    { name: 'Partzufim', desc: 'Divine Configurations', icon: '👑', color: 'from-amber-500 to-amber-600' },
    { name: 'Neshama', desc: 'Soul Levels', icon: '🕊️', color: 'from-cyan-500 to-cyan-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-10 w-64 h-64 bg-purple-400 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
          </div>
          
          <div className="relative p-8 md:p-12">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles className="w-10 h-10 text-purple-300" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">Kabbalah & Zohar</h1>
            </div>
            <p className="text-purple-200 text-lg">
              Unlock the mystical wisdom of Torah's hidden dimensions
            </p>
          </div>
        </motion.div>

        {/* Kabbalah Categories */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Mystical Concepts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
              >
                <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all group h-full">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${cat.color} rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.name}</h3>
                    <p className="text-slate-600 text-sm mb-4">{cat.desc}</p>
                    <Button variant="outline" className="w-full">Explore</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Zohar Study */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-2xl">
                <Star className="w-6 h-6 text-purple-600" />
                <span>Zohar Study Sessions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {zoharSections.length > 0 ? (
                <div className="space-y-4">
                  {zoharSections.map((section) => (
                    <div key={section.id} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                      <h3 className="font-bold text-lg text-slate-900">{section.title}</h3>
                      <p className="text-amber-700 font-semibold" dir="rtl">{section.title_hebrew}</p>
                      <p className="text-sm text-slate-600 mt-2">Parsha: {section.parsha}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Zohar content coming soon</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}