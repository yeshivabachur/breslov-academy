// FEATURE REGISTRY - Single Source of Truth
// DO NOT delete features from this registry. Only add.

export const FEATURE_AREAS = {
  core: { label: 'Core Learning', color: 'bg-blue-100 text-blue-800', order: 1 },
  teach: { label: 'Teaching Tools', color: 'bg-green-100 text-green-800', order: 2 },
  admin: { label: 'Administration', color: 'bg-purple-100 text-purple-800', order: 3 },
  marketing: { label: 'Marketing & Sales', color: 'bg-amber-100 text-amber-800', order: 4 },
  labs: { label: 'Labs & Experiments', color: 'bg-pink-100 text-pink-800', order: 5 },
  system: { label: 'System & Utilities', color: 'bg-slate-100 text-slate-800', order: 6 }
};

export const FEATURES = {
  // CORE LEARNING
  dashboard: { key: 'Dashboard', label: 'Dashboard', route: '/dashboard', area: 'core', audiences: ['student', 'teacher', 'admin'], icon: 'Home', order: 1 },
  courses: { key: 'Courses', label: 'Courses', route: '/courses', area: 'core', audiences: ['student', 'teacher', 'admin'], icon: 'BookOpen', order: 2 },
  courseDetail: { key: 'CourseDetail', label: 'Course Detail', route: '/coursedetail', area: 'core', audiences: ['student', 'teacher', 'admin'], icon: 'Book', hidden: true },
  lessonViewer: { key: 'LessonViewer', label: 'Lesson Viewer', route: '/lessonviewer', area: 'core', audiences: ['student', 'teacher', 'admin'], icon: 'Play', hidden: true },
  lessonViewerPremium: { key: 'LessonViewerPremium', label: 'Lesson Viewer Premium', route: '/lessonviewerpremium', area: 'core', audiences: ['student', 'teacher', 'admin'], icon: 'Play', hidden: true },
  reader: { key: 'Reader', label: 'Smart Reader', route: '/reader', area: 'core', audiences: ['student', 'teacher', 'admin'], icon: 'BookMarked', order: 3 },
  feed: { key: 'Feed', label: 'Community', route: '/feed', area: 'core', audiences: ['student', 'teacher', 'admin'], icon: 'Users', order: 4 },
  schoolSearch: { key: 'SchoolSearch', label: 'Search', route: '/schoolsearch', area: 'core', audiences: ['student', 'teacher', 'admin'], icon: 'Search', order: 5 },
  myProgress: { key: 'MyProgress', label: 'My Progress', route: '/myprogress', area: 'core', audiences: ['student'], icon: 'TrendingUp', vaultOnly: true },
  downloads: { key: 'Downloads', label: 'Downloads', route: '/downloads', area: 'core', audiences: ['student', 'teacher', 'admin'], icon: 'Download', vaultOnly: true },
  
  // TEACHING
  teach: { key: 'Teach', label: 'Teach', route: '/teach', area: 'teach', audiences: ['teacher', 'admin'], icon: 'GraduationCap', order: 1 },
  teachCourse: { key: 'TeachCourse', label: 'Course Builder', route: '/teachcourse', area: 'teach', audiences: ['teacher', 'admin'], icon: 'Edit', hidden: true },
  teachCourseNew: { key: 'TeachCourseNew', label: 'New Course', route: '/teachcoursenew', area: 'teach', audiences: ['teacher', 'admin'], icon: 'Plus', hidden: true },
  teachLesson: { key: 'TeachLesson', label: 'Lesson Editor', route: '/teachlesson', area: 'teach', audiences: ['teacher', 'admin'], icon: 'FileEdit', hidden: true },
  teachAnalytics: { key: 'TeachAnalytics', label: 'Teaching Analytics', route: '/teachanalytics', area: 'teach', audiences: ['teacher', 'admin'], icon: 'BarChart', order: 2 },
  
  // ADMIN
  schoolAdmin: { key: 'SchoolAdmin', label: 'School Admin', route: '/schooladmin', area: 'admin', audiences: ['admin'], icon: 'Settings', order: 1 },
  schoolAnalytics: { key: 'SchoolAnalytics', label: 'School Analytics', route: '/schoolanalytics', area: 'admin', audiences: ['admin'], icon: 'TrendingUp', order: 2 },
  schoolMonetization: { key: 'SchoolMonetization', label: 'Monetization', route: '/schoolmonetization', area: 'admin', audiences: ['admin'], icon: 'DollarSign', order: 3 },
  schoolNew: { key: 'SchoolNew', label: 'Create School', route: '/schoolnew', area: 'admin', audiences: ['admin'], icon: 'Plus', hidden: true },
  schoolJoin: { key: 'SchoolJoin', label: 'Join School', route: '/schooljoin', area: 'system', audiences: ['student', 'teacher', 'admin'], hidden: true },
  adminHardening: { key: 'AdminHardening', label: 'Security Hardening', route: '/adminhardening', area: 'admin', audiences: ['admin'], icon: 'Shield', vaultOnly: true },
  legacyMigration: { key: 'LegacyMigration', label: 'Legacy Migration', route: '/legacymigration', area: 'admin', audiences: ['admin'], icon: 'Database', vaultOnly: true },
  
  // MARKETING & STOREFRONT
  schoolLanding: { key: 'schoollanding', label: 'Landing Page', route: '/schoollanding', area: 'marketing', audiences: ['public', 'student', 'teacher', 'admin'], icon: 'Globe' },
  schoolCourses: { key: 'schoolcourses', label: 'Course Catalog', route: '/schoolcourses', area: 'marketing', audiences: ['public', 'student', 'teacher', 'admin'], icon: 'Library' },
  courseSales: { key: 'coursesales', label: 'Sales Page', route: '/coursesales', area: 'marketing', audiences: ['public', 'student', 'teacher', 'admin'], icon: 'ShoppingBag', hidden: true },
  schoolCheckout: { key: 'schoolcheckout', label: 'Checkout', route: '/schoolcheckout', area: 'marketing', audiences: ['public', 'student', 'teacher', 'admin'], icon: 'CreditCard', hidden: true },
  schoolThankYou: { key: 'schoolthankyou', label: 'Thank You', route: '/schoolthankyou', area: 'marketing', audiences: ['public', 'student', 'teacher', 'admin'], hidden: true },
  
  // LABS
  languageLearning: { key: 'LanguageLearning', label: 'Languages', route: '/languagelearning', area: 'labs', audiences: ['student', 'teacher', 'admin'], icon: 'Globe' },
  studySets: { key: 'StudySets', label: 'Study Sets', route: '/studysets', area: 'labs', audiences: ['student', 'teacher', 'admin'], icon: 'Layers' },
  studySetNew: { key: 'StudySetNew', label: 'New Study Set', route: '/studysetnew', area: 'labs', audiences: ['student', 'teacher', 'admin'], hidden: true },
  studySetPractice: { key: 'StudySetPractice', label: 'Practice', route: '/studysetpractice', area: 'labs', audiences: ['student', 'teacher', 'admin'], hidden: true },
  cohorts: { key: 'Cohorts', label: 'Cohorts', route: '/cohorts', area: 'labs', audiences: ['student', 'teacher', 'admin'], icon: 'Users' },
  cohortDetail: { key: 'CohortDetail', label: 'Cohort Detail', route: '/cohortdetail', area: 'labs', audiences: ['student', 'teacher', 'admin'], hidden: true },
  offline: { key: 'Offline', label: 'Offline', route: '/offline', area: 'labs', audiences: ['student', 'teacher', 'admin'], icon: 'Download' },
  achievements: { key: 'Achievements', label: 'Achievements', route: '/achievements', area: 'labs', audiences: ['student', 'teacher', 'admin'], icon: 'Award' },
  challenges: { key: 'Challenges', label: 'Challenges', route: '/challenges', area: 'labs', audiences: ['student', 'teacher', 'admin'], icon: 'Trophy' },
  affiliate: { key: 'Affiliate', label: 'Affiliate Program', route: '/affiliate', area: 'labs', audiences: ['student', 'teacher', 'admin'], icon: 'Users', vaultOnly: true },
  
  // SYSTEM
  schoolSelect: { key: 'SchoolSelect', label: 'School Select', route: '/schoolselect', area: 'system', audiences: ['student', 'teacher', 'admin'], icon: 'Building', hidden: true },
  integrations: { key: 'Integrations', label: 'Integrations', route: '/integrations', area: 'system', audiences: ['student', 'teacher', 'admin'], icon: 'Plug' },
  portfolio: { key: 'Portfolio', label: 'Profile', route: '/portfolio', area: 'system', audiences: ['student', 'teacher', 'admin'], icon: 'User' },
  vault: { key: 'Vault', label: 'Vault', route: '/vault', area: 'system', audiences: ['student', 'teacher', 'admin'], icon: 'Archive' },
  oauth2callback: { key: 'oauth2callback', label: 'OAuth Callback', route: '/oauth2callback', area: 'system', audiences: ['public'], hidden: true },
  integrity: { key: 'Integrity', label: 'Integrity Check', route: '/integrity', area: 'system', audiences: ['admin'], icon: 'CheckCircle', vaultOnly: true },
  subscription: { key: 'Subscription', label: 'Subscription', route: '/subscription', area: 'system', audiences: ['student', 'teacher', 'admin'], hidden: true }
};

// Helper functions
export const normalizeAudienceFromRole = (role) => {
  if (!role) return 'student';
  const r = role.toUpperCase();
  if (r === 'OWNER' || r === 'ADMIN') return 'admin';
  if (r === 'INSTRUCTOR' || r === 'TA') return 'teacher';
  return 'student';
};

export const getFeatureByKey = (key) => FEATURES[key];

export const getFeaturesForAudience = (audience) => {
  return Object.values(FEATURES).filter(f => f.audiences.includes(audience));
};

export const getFeaturesByArea = (area) => {
  return Object.values(FEATURES).filter(f => f.area === area);
};

export const getAllRoutes = () => {
  return Object.values(FEATURES).map(f => f.route);
};

export const getNavGroupsForAudience = (audience) => {
  const groups = {};
  Object.values(FEATURES)
    .filter(f => !f.hidden && !f.vaultOnly && f.audiences.includes(audience))
    .forEach(feature => {
      if (!groups[feature.area]) {
        groups[feature.area] = {
          ...FEATURE_AREAS[feature.area],
          features: []
        };
      }
      groups[feature.area].features.push(feature);
    });
  
  // Sort features within each group by order
  Object.values(groups).forEach(group => {
    group.features.sort((a, b) => (a.order || 999) - (b.order || 999));
  });
  
  return Object.values(groups).sort((a, b) => a.order - b.order);
};