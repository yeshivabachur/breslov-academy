import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Search, Star, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Marketplace() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  const { data: courses = [] } = useQuery({
    queryKey: ['marketplace-courses'],
    queryFn: () => base44.entities.Course.filter({ is_published: true })
  });

  const { data: bundles = [] } = useQuery({
    queryKey: ['course-bundles'],
    queryFn: () => base44.entities.CourseBundle.list()
  });

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || c.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Torah', 'Talmud', 'Kabbalah', 'Halacha', 'Chassidus', 'Hebrew'];

  return (
    <div className="min-h-screen gradient-mesh bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-slate-900">Course Marketplace</h1>
              <p className="text-xl text-slate-600">Discover and purchase individual courses</p>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="pl-12 rounded-xl"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                      category === cat
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-white text-slate-700 hover:shadow-md'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Bundles */}
        {bundles.length > 0 && (
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-6">Featured Bundles - Save Big!</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {bundles.slice(0, 2).map((bundle, idx) => (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="card-modern border-purple-200 border-2 premium-shadow-lg hover:premium-shadow-xl transition-all rounded-[2rem] overflow-hidden">
                    <div className="h-3 bg-gradient-to-r from-purple-500 to-pink-600" />
                    <CardContent className="p-6">
                      <Badge className="bg-purple-100 text-purple-800 mb-3">BUNDLE - SAVE {bundle.discount_percentage}%</Badge>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">{bundle.name}</h3>
                      <p className="text-slate-600 mb-4">{bundle.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-slate-600 line-through">${bundle.original_price}</div>
                          <div className="text-3xl font-black text-purple-600">${bundle.bundle_price}</div>
                        </div>
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl">
                          View Bundle
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Course Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-slate-900">All Courses</h2>
            <div className="text-slate-600">{filteredCourses.length} courses</div>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="card-modern border-white/60 premium-shadow hover:premium-shadow-lg transition-all rounded-2xl overflow-hidden h-full cursor-pointer">
                  <div className="h-40 bg-gradient-to-br from-slate-900 to-blue-900 relative">
                    {course.thumbnail_url && (
                      <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    )}
                    <Badge className="absolute top-2 right-2 bg-slate-900/80 text-white">
                      {course.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-black text-slate-900 line-clamp-2 leading-tight">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span>4.9 (234)</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div className="text-2xl font-black text-slate-900">
                        ${course.price || 0}
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl">
                        Buy Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}