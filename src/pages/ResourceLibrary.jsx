import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Search, Filter, BookOpen, Video, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const resources = [
    { title: 'Breslov Prayer Guide', type: 'PDF', category: 'Prayer', size: '2.4 MB', downloads: 1245, icon: FileText, color: 'from-red-500 to-red-600' },
    { title: 'Hitbodedut Meditation Audio', type: 'Audio', category: 'Practice', size: '45 MB', downloads: 892, icon: Headphones, color: 'from-purple-500 to-purple-600' },
    { title: 'Talmud Study Companion', type: 'PDF', category: 'Study', size: '5.1 MB', downloads: 2103, icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { title: 'Kabbalah Introduction Video', type: 'Video', category: 'Learning', size: '128 MB', downloads: 1567, icon: Video, color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <div className="min-h-screen gradient-mesh bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Resource Library</h1>
          <p className="text-xl text-slate-600">Download study materials, guides, and media</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="pl-12 py-6 rounded-2xl"
            />
          </div>
          <Button variant="outline" className="rounded-2xl px-6">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, idx) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all rounded-[2rem]">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${resource.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-slate-900 text-lg mb-2 truncate">
                          {resource.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-slate-100 text-slate-700">
                            {resource.type}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-700">
                            {resource.category}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>{resource.size}</span>
                          <span className="font-semibold">{resource.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl btn-premium">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}