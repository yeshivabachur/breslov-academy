import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Archive, Search } from 'lucide-react';

// Inline feature registry to avoid import issues
const FEATURES = {
  dashboard: { key: 'dashboard', label: 'Dashboard', area: 'core', audiences: ['student', 'teacher', 'admin'] },
  courses: { key: 'courses', label: 'Courses', area: 'core', audiences: ['student', 'teacher', 'admin'] },
  courseDetail: { key: 'coursedetail', label: 'Course Detail', area: 'core', audiences: ['student', 'teacher', 'admin'], hidden: true },
  lessonViewer: { key: 'lessonviewerpremium', label: 'Lesson Viewer', area: 'core', audiences: ['student', 'teacher', 'admin'], hidden: true },
  reader: { key: 'reader', label: 'Smart Reader', area: 'core', audiences: ['student', 'teacher', 'admin'] },
  feed: { key: 'feed', label: 'Community', area: 'core', audiences: ['student', 'teacher', 'admin'] },
  search: { key: 'schoolsearch', label: 'Search', area: 'core', audiences: ['student', 'teacher', 'admin'] },
  teach: { key: 'teach', label: 'Teach', area: 'teach', audiences: ['teacher', 'admin'] },
  teachCourse: { key: 'teachcourse', label: 'Course Builder', area: 'teach', audiences: ['teacher', 'admin'], hidden: true },
  teachLesson: { key: 'teachlesson', label: 'Lesson Editor', area: 'teach', audiences: ['teacher', 'admin'], hidden: true },
  teachAnalytics: { key: 'teachanalytics', label: 'Teaching Analytics', area: 'teach', audiences: ['teacher', 'admin'] },
  schoolAdmin: { key: 'schooladmin', label: 'School Admin', area: 'admin', audiences: ['admin'] },
  schoolAnalytics: { key: 'schoolanalytics', label: 'School Analytics', area: 'admin', audiences: ['admin'] },
  schoolLanding: { key: 'schoollanding', label: 'School Landing', area: 'marketing', audiences: ['public', 'student', 'teacher', 'admin'] },
  schoolCourses: { key: 'schoolcourses', label: 'Course Catalog', area: 'marketing', audiences: ['public', 'student', 'teacher', 'admin'] },
  courseSales: { key: 'coursesales', label: 'Course Sales', area: 'marketing', audiences: ['public', 'student', 'teacher', 'admin'] },
  schoolCheckout: { key: 'schoolcheckout', label: 'Checkout', area: 'marketing', audiences: ['public', 'student', 'teacher', 'admin'] },
  languageLearning: { key: 'languagelearning', label: 'Language Learning', area: 'labs', audiences: ['student', 'teacher', 'admin'] },
  studySets: { key: 'studysets', label: 'Study Sets', area: 'labs', audiences: ['student', 'teacher', 'admin'] },
  cohorts: { key: 'cohorts', label: 'Cohorts', area: 'labs', audiences: ['student', 'teacher', 'admin'] },
  offline: { key: 'offline', label: 'Offline Mode', area: 'labs', audiences: ['student', 'teacher', 'admin'] },
  schoolSelect: { key: 'schoolselect', label: 'School Select', area: 'system', audiences: ['student', 'teacher', 'admin'], hidden: true },
  integrations: { key: 'integrations', label: 'Integrations', area: 'system', audiences: ['student', 'teacher', 'admin'] },
  portfolio: { key: 'portfolio', label: 'Profile', area: 'system', audiences: ['student', 'teacher', 'admin'] },
  vault: { key: 'vault', label: 'Vault', area: 'system', audiences: ['student', 'teacher', 'admin'] },
  adminHardening: { key: 'adminhardening', label: 'Admin Hardening', area: 'admin', audiences: ['admin'] }
};

const getFeaturesByArea = (area) => Object.values(FEATURES).filter(f => f.area === area);

export default function Vault() {
  const [searchQuery, setSearchQuery] = useState('');

  const allFeatures = Object.values(FEATURES);
  const filteredFeatures = allFeatures.filter(f => 
    f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const areas = {
    core: { label: 'Core Learning', color: 'bg-blue-100 text-blue-800' },
    teach: { label: 'Teaching Tools', color: 'bg-green-100 text-green-800' },
    admin: { label: 'Administration', color: 'bg-purple-100 text-purple-800' },
    marketing: { label: 'Marketing & Sales', color: 'bg-amber-100 text-amber-800' },
    labs: { label: 'Labs & Experiments', color: 'bg-pink-100 text-pink-800' },
    system: { label: 'System & Utilities', color: 'bg-slate-100 text-slate-800' }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Archive className="w-8 h-8 text-amber-600 mr-3" />
          <h1 className="text-3xl font-bold">Vault</h1>
        </div>
        <p className="text-slate-600 mb-6">
          Complete directory of all platform features. Nothing is ever removed - everything is preserved here.
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search features..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{allFeatures.length}</div>
            <div className="text-sm text-slate-600">Total Features</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{getFeaturesByArea('core').length}</div>
            <div className="text-sm text-slate-600">Core</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{getFeaturesByArea('admin').length}</div>
            <div className="text-sm text-slate-600">Admin</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{getFeaturesByArea('marketing').length}</div>
            <div className="text-sm text-slate-600">Marketing</div>
          </CardContent>
        </Card>
      </div>

      {/* Features by Area */}
      {Object.entries(areas).map(([areaKey, areaInfo]) => {
        const areaFeatures = filteredFeatures.filter(f => f.area === areaKey);
        if (areaFeatures.length === 0) return null;

        return (
          <Card key={areaKey} className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className={areaInfo.color}>{areaInfo.label}</Badge>
                <span className="ml-2 text-sm text-slate-500">({areaFeatures.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {areaFeatures.map((feature) => (
                  <Link 
                    key={feature.key} 
                    to={createPageUrl(feature.key)}
                    className="p-3 border rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{feature.label}</span>
                      {feature.hidden && (
                        <Badge variant="outline" className="text-xs">Hidden</Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {feature.audiences.join(', ')}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {filteredFeatures.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No features found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}