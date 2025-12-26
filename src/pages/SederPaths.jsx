import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Network } from 'lucide-react';
import { motion } from 'framer-motion';
import SederPath from '../components/learning/SederPath';
import KnowledgeGraph from '../components/learning/KnowledgeGraph';

export default function SederPaths() {
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

  const { data: courses = [] } = useQuery({
    queryKey: ['all-courses'],
    queryFn: () => base44.entities.Course.list()
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ['user-progress', user?.email],
    queryFn: () => base44.entities.UserProgress.filter({ user_email: user.email }),
    enabled: !!user?.email
  });

  const completedCourseIds = [...new Set(
    userProgress.filter(p => p.completed).map(p => p.course_id)
  )];

  const sedarim = [
    {
      order: 1,
      name: 'Seder Alef - Foundations of Emunah',
      description: 'Begin your journey with the fundamentals of faith and belief',
      courseIds: courses.filter(c => c.category === 'Torah').slice(0, 5).map(c => c.id)
    },
    {
      order: 2,
      name: 'Seder Bet - Talmudic Reasoning',
      description: 'Master the art of Torah logic and analysis',
      courseIds: courses.filter(c => c.category === 'Talmud').slice(0, 6).map(c => c.id)
    },
    {
      order: 3,
      name: 'Seder Gimmel - Mystical Dimensions',
      description: 'Explore Kabbalah and hidden teachings',
      courseIds: courses.filter(c => c.category === 'Kabbalah').slice(0, 4).map(c => c.id)
    },
    {
      order: 4,
      name: 'Seder Dalet - Practical Halacha',
      description: 'Apply Jewish law to daily life',
      courseIds: courses.filter(c => c.category === 'Halacha').slice(0, 5).map(c => c.id)
    }
  ];

  // Build knowledge graph data
  const graphConcepts = courses.slice(0, 12).map(course => ({
    id: course.id,
    name: course.title?.substring(0, 15) + '...',
    prerequisites: course.prerequisite_ids || [],
    available: completedCourseIds.length === 0 || course.prerequisite_ids?.every(id => completedCourseIds.includes(id))
  }));

  return (
    <div className="min-h-screen gradient-mesh bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-6xl font-black text-slate-900 font-serif">Seder HaLimud</h1>
              <p className="text-xl text-slate-600 font-serif">Structured Order of Torah Study</p>
            </div>
          </div>
        </motion.div>

        {/* Knowledge Graph Overview */}
        <KnowledgeGraph 
          concepts={graphConcepts} 
          userProgress={completedCourseIds}
        />

        {/* Sedarim */}
        <div className="space-y-8">
          {sedarim.map((seder, idx) => {
            const sederCourses = courses.filter(c => seder.courseIds.includes(c.id));
            
            return (
              <motion.div
                key={seder.order}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
              >
                <SederPath
                  seder={seder}
                  courses={sederCourses}
                  userProgress={{ completedCourses: completedCourseIds }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}