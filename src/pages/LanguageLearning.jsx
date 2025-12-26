import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, Award, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import FlashcardPractice from '../components/language/FlashcardPractice';

export default function LanguageLearning() {
  const [user, setUser] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);
  const language = urlParams.get('lang');
  const [practiceMode, setPracticeMode] = useState(null);

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

  const { data: lessons = [] } = useQuery({
    queryKey: ['language-lessons', language],
    queryFn: () => base44.entities.LanguageLesson.filter({ language }, 'lesson_number'),
    enabled: !!language
  });

  const { data: langProgress } = useQuery({
    queryKey: ['language-progress', user?.email, language],
    queryFn: async () => {
      const progs = await base44.entities.LanguageProgress.filter({ 
        user_email: user.email,
        language 
      });
      return progs[0];
    },
    enabled: !!user?.email && !!language
  });

  const languageNames = {
    biblical_hebrew: { name: 'Biblical Hebrew', hebrew: 'עברית מקראית' },
    torah_hebrew: { name: 'Torah Hebrew', hebrew: 'עברית תורנית' },
    talmud_bavli: { name: 'Talmud Bavli', hebrew: 'תלמוד בבלי' },
    modern_hebrew: { name: 'Modern Hebrew', hebrew: 'עברית חדשה' },
    aramaic: { name: 'Aramaic', hebrew: 'ארמית' },
    yiddish: { name: 'Yiddish', hebrew: 'אידיש' },
    ancient_hebrew: { name: 'Ancient Hebrew', hebrew: 'עברית עתיקה' }
  };

  const currentLang = languageNames[language];

  if (practiceMode && lessons.length > 0) {
    const allVocabulary = lessons.flatMap(l => l.vocabulary || []);
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setPracticeMode(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lessons
        </Button>
        <FlashcardPractice 
          vocabulary={allVocabulary}
          onComplete={(results) => {
            setPracticeMode(null);
            // Save progress
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link to={createPageUrl('Languages')}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Languages
          </Button>
        </Link>

        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{currentLang?.name}</h1>
          <p className="text-2xl text-blue-200 mb-4" dir="rtl">{currentLang?.hebrew}</p>
          <div className="flex items-center space-x-6 text-blue-100">
            <div className="flex items-center">
              <Flame className="w-5 h-5 mr-2" />
              <span>{langProgress?.streak_days || 0} day streak</span>
            </div>
            <div className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              <span>{langProgress?.words_learned || 0} words learned</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              <span>{langProgress?.lessons_completed || 0} lessons completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Practice Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setPracticeMode('flashcards')}>
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🃏</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Flashcards</h3>
            <p className="text-slate-600 text-sm">Practice vocabulary with interactive flashcards</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✍️</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Writing Practice</h3>
            <p className="text-slate-600 text-sm">Learn to write in Hebrew script</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🗣️</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Speaking</h3>
            <p className="text-slate-600 text-sm">Practice pronunciation and speaking</p>
          </CardContent>
        </Card>
      </div>

      {/* Lessons */}
      <Card>
        <CardHeader>
          <CardTitle>Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          {lessons.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <p>Lessons coming soon!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div>
                    <h4 className="font-semibold">Lesson {lesson.lesson_number}: {lesson.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">
                      {lesson.vocabulary?.length || 0} new words • {lesson.level}
                    </p>
                  </div>
                  <Button size="sm">Start Lesson</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}