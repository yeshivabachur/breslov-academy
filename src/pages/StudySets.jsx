import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Brain, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import StudyModes from '../components/study/StudyModes';
import ChazaraFlashcards from '../components/learning/ChazaraFlashcards';

export default function StudySets() {
  const [user, setUser] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);

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

  const { data: studySets = [] } = useQuery({
    queryKey: ['study-sets'],
    queryFn: () => base44.entities.StudySet.list('-created_date')
  });

  if (selectedSet) {
    return (
      <div className="min-h-screen gradient-mesh bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-8">
          <Button
            onClick={() => setSelectedSet(null)}
            variant="ghost"
            className="font-serif"
          >
            ← Back to Study Sets
          </Button>
          
          <StudyModes
            studySet={selectedSet}
            onComplete={(results) => {
              console.log('Study session complete:', results);
              setSelectedSet(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-black text-slate-900 font-serif">Study Sets</h1>
                <p className="text-xl text-slate-600 font-serif">Master Torah concepts through active recall</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-2xl font-serif">
              <Plus className="w-5 h-5 mr-2" />
              Create Set
            </Button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {studySets.map((set, idx) => (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedSet(set)}
            >
              <Card className="card-modern border-white/60 premium-shadow hover:premium-shadow-lg transition-all rounded-2xl cursor-pointer">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-black text-lg text-slate-900 font-serif mb-1">
                        {set.title}
                      </h3>
                      <p className="text-sm text-slate-600 font-serif">
                        {set.term_count || 0} terms
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold">4.8</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge className="bg-blue-100 text-blue-800 font-serif">
                      {set.category}
                    </Badge>
                    <Badge variant="outline" className="font-serif">
                      {set.language || 'Hebrew/English'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}