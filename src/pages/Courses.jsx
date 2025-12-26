import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseCard from '../components/courses/CourseCard';
import AdvancedSearch from '../components/search/AdvancedSearch';

export default function Courses() {
  const [user, setUser] = useState(null);
  const [userTier, setUserTier] = useState('free');
  const [filteredCourses, setFilteredCourses] = useState([]);

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

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => base44.entities.Course.filter({ is_published: true }, 'sort_order')
  });

  useEffect(() => {
    if (subscription?.tier) {
      setUserTier(subscription.tier);
    }
  }, [subscription]);

  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  const handleFilter = (filtered) => {
    setFilteredCourses(filtered);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">Torah Course Library</h1>
          <p className="text-xl text-slate-600 font-light leading-relaxed">
            Journey through the profound teachings of Rebbe Nachman of Breslov זי"ע
          </p>
        </div>
        <div className="inline-flex items-center space-x-2 bg-amber-100 px-4 py-2 rounded-xl">
          <span className="text-amber-800 font-bold text-sm">ספריית קורסים</span>
          <span className="text-amber-600">•</span>
          <span className="text-amber-700 text-sm font-semibold">Likutey Moharan & Sacred Teachings</span>
        </div>
      </div>

      {/* Advanced Search */}
      <AdvancedSearch courses={courses} onFilter={handleFilter} />

      {/* Results */}
      <div>
        <p className="text-slate-600 mb-6">
          Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} userTier={userTier} />
          ))}
        </div>

        {filteredCourses.length === 0 && !isLoading && (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-300">
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg font-semibold mb-2">No courses found</p>
            <p className="text-slate-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
}