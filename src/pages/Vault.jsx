import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Lock, Unlock } from 'lucide-react';

export default function Vault() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Access control: only admins or RABBI role
        if (currentUser.role !== 'admin' && currentUser.role_label !== 'RABBI') {
          navigate(createPageUrl('Dashboard'));
        }
      } catch (error) {
        base44.auth.redirectToLogin();
      }
    };
    loadUser();
  }, [navigate]);

  // Comprehensive catalog of all existing features
  const features = [
    // Core Learning
    { id: 'dashboard', title: 'Dashboard', description: 'Main user dashboard with overview and stats', category: 'Core Learning', type: 'Core', path: 'Dashboard' },
    { id: 'courses', title: 'Courses', description: 'Course catalog and library', category: 'Core Learning', type: 'Core', path: 'Courses' },
    { id: 'coursedetail', title: 'Course Detail', description: 'Individual course page with lessons', category: 'Core Learning', type: 'Core', path: 'CourseDetail' },
    { id: 'lessonviewer', title: 'Lesson Viewer', description: 'Video/content player for lessons', category: 'Core Learning', type: 'Core', path: 'LessonViewer' },
    { id: 'myprogress', title: 'My Progress', description: 'User learning progress tracker', category: 'Core Learning', type: 'Core', path: 'MyProgress' },
    { id: 'learningpaths', title: 'Learning Paths', description: 'Structured learning journeys', category: 'Core Learning', type: 'Labs', path: 'LearningPaths' },
    { id: 'microlearning', title: 'Microlearning', description: 'Bite-sized learning modules', category: 'Core Learning', type: 'Labs', path: 'Microlearning' },
    { id: 'adaptivelearning', title: 'Adaptive Learning', description: 'AI-powered personalized learning', category: 'Core Learning', type: 'Labs', path: 'AdaptiveLearning' },

    // Community
    { id: 'feed', title: 'Feed', description: 'Social learning feed', category: 'Community', type: 'Core', path: 'Feed' },
    { id: 'forums', title: 'Forums', description: 'Discussion forums', category: 'Community', type: 'Labs', path: 'Forums' },
    { id: 'community', title: 'Community', description: 'Community hub', category: 'Community', type: 'Labs', path: 'Community' },
    { id: 'studygroups', title: 'Study Groups', description: 'Collaborative study groups', category: 'Community', type: 'Labs', path: 'StudyGroup' },
    { id: 'studybuddies', title: 'Study Buddies', description: 'Find study partners', category: 'Community', type: 'Labs', path: 'StudyBuddies' },
    { id: 'messages', title: 'Messages', description: 'Direct messaging system', category: 'Community', type: 'Labs', path: 'Messages' },
    { id: 'mentorship', title: 'Mentorship', description: 'Mentorship program', category: 'Community', type: 'Labs', path: 'Mentorship' },
    { id: 'events', title: 'Events', description: 'Community events calendar', category: 'Community', type: 'Labs', path: 'Events' },
    { id: 'alumninetwork', title: 'Alumni Network', description: 'Connect with alumni', category: 'Community', type: 'Labs', path: 'AlumniNetwork' },

    // Assessments
    { id: 'challenges', title: 'Challenges', description: 'Learning challenges and competitions', category: 'Assessments', type: 'Labs', path: 'Challenges' },
    { id: 'tournaments', title: 'Tournaments', description: 'Competitive learning tournaments', category: 'Assessments', type: 'Labs', path: 'Tournaments' },
    { id: 'studysets', title: 'Study Sets', description: 'Flashcard study sets', category: 'Assessments', type: 'Labs', path: 'StudySets' },
    { id: 'studyset', title: 'Study Set Detail', description: 'Individual study set practice', category: 'Assessments', type: 'Labs', path: 'StudySet' },

    // Credentials & Achievements
    { id: 'achievements', title: 'Achievements', description: 'Achievement system and badges', category: 'Credentials', type: 'Labs', path: 'Achievements' },
    { id: 'leaderboard', title: 'Leaderboard', description: 'Global rankings and competition', category: 'Credentials', type: 'Core', path: 'Leaderboard' },
    { id: 'portfolio', title: 'Portfolio', description: 'User learning portfolio', category: 'Credentials', type: 'Core', path: 'Portfolio' },
    { id: 'skills', title: 'Skills', description: 'Skills tracking and endorsements', category: 'Credentials', type: 'Labs', path: 'Skills' },

    // Monetization
    { id: 'subscription', title: 'Subscription', description: 'Subscription tiers and pricing', category: 'Monetization', type: 'Core', path: 'Subscription' },
    { id: 'marketplace', title: 'Marketplace', description: 'Course marketplace', category: 'Monetization', type: 'Core', path: 'Marketplace' },
    { id: 'rewardsshop', title: 'Rewards Shop', description: 'Redeem points for rewards', category: 'Monetization', type: 'Labs', path: 'RewardsShop' },
    { id: 'scholarships', title: 'Scholarships', description: 'Scholarship program', category: 'Monetization', type: 'Labs', path: 'Scholarships' },
    { id: 'affiliate', title: 'Affiliate Program', description: 'Affiliate marketing program', category: 'Monetization', type: 'Labs', path: 'AffiliateProgram' },

    // Language Learning
    { id: 'languages', title: 'Languages', description: 'Language learning hub', category: 'Language Learning', type: 'Labs', path: 'Languages' },
    { id: 'languagelearning', title: 'Language Learning', description: 'Language course viewer', category: 'Language Learning', type: 'Labs', path: 'LanguageLearning' },

    // Career & Development
    { id: 'careerpaths', title: 'Career Paths', description: 'Career development guidance', category: 'Career', type: 'Labs', path: 'CareerPaths' },

    // Integrations
    { id: 'integrations', title: 'Integrations', description: 'Third-party service integrations', category: 'Integrations', type: 'Core', path: 'Integrations' },
    { id: 'oauth2callback', title: 'OAuth Callback', description: 'OAuth authentication handler', category: 'Integrations', type: 'Core', path: 'oauth2callback' },

    // Live & Streaming
    { id: 'livestreams', title: 'Live Streams', description: 'Live streaming classes', category: 'Live Content', type: 'Labs', path: 'LiveStreams' },

    // Analytics & Tracking
    { id: 'analytics', title: 'Analytics', description: 'Learning analytics dashboard', category: 'Analytics', type: 'Labs', path: 'Analytics' },
    { id: 'habittracker', title: 'Habit Tracker', description: 'Study habit tracking', category: 'Wellness', type: 'Labs', path: 'HabitTracker' },

    // Downloads
    { id: 'downloads', title: 'Downloads', description: 'Download center for offline content', category: 'Content', type: 'Labs', path: 'Downloads' },
  ];

  const categories = [
    'all',
    'Core Learning',
    'Community',
    'Assessments',
    'Credentials',
    'Monetization',
    'Language Learning',
    'Career',
    'Integrations',
    'Live Content',
    'Analytics',
    'Wellness',
    'Content'
  ];

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 rounded-xl p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-3">
          <Lock className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold text-white">Feature Vault</h1>
        </div>
        <p className="text-purple-200 text-lg">
          Internal catalog of all features and pages in the Breslov Academy platform
        </p>
        <Badge className="mt-3 bg-amber-500 text-slate-900">
          {user.role === 'admin' ? 'Admin Access' : 'Rabbi Access'}
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Features</CardDescription>
            <CardTitle className="text-2xl">{features.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Core Features</CardDescription>
            <CardTitle className="text-2xl">{features.filter(f => f.type === 'Core').length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Labs Features</CardDescription>
            <CardTitle className="text-2xl">{features.filter(f => f.type === 'Labs').length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-2xl">{categories.length - 1}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFeatures.map(feature => (
          <a key={feature.id} href={createPageUrl(feature.path)}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer hover:border-amber-500">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <Badge variant={feature.type === 'Core' ? 'default' : 'secondary'}>
                    {feature.type}
                  </Badge>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-xs">
                  {feature.category}
                </Badge>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {filteredFeatures.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed">
          <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 text-lg font-semibold">No features found</p>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}