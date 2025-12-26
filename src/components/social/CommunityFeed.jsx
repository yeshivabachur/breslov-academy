import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunityFeed() {
  const posts = [
    {
      id: 1,
      author: 'Moshe L.',
      authorLevel: 'Scholar',
      content: 'Just completed my 30-day learning streak! The concept of Azamra has transformed my perspective.',
      timestamp: new Date(Date.now() - 3600000),
      likes: 24,
      comments: 5,
      achievement: 'Monthly Warrior'
    },
    {
      id: 2,
      author: 'David K.',
      authorLevel: 'Student',
      content: 'Amazing shiur on Likutey Moharan today. Rabbi Cohen\'s explanation of prayer was enlightening.',
      timestamp: new Date(Date.now() - 7200000),
      likes: 18,
      comments: 3
    },
    {
      id: 3,
      author: 'Sarah M.',
      authorLevel: 'Sage',
      content: 'Looking for a chavruta partner for evening Gemara study. DM me!',
      timestamp: new Date(Date.now() - 10800000),
      likes: 12,
      comments: 8
    }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2.5rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <div>
            <div>Community Feed</div>
            <div className="text-sm text-slate-600 font-normal" dir="rtl">עדכוני קהילה</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {post.author[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">{post.author}</span>
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    {post.authorLevel}
                  </Badge>
                  {post.achievement && (
                    <Badge className="bg-amber-100 text-amber-800 text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      {post.achievement}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {post.timestamp.toLocaleDateString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </div>
              </div>
            </div>

            <p className="text-slate-700 mb-4 leading-relaxed">{post.content}</p>

            <div className="flex items-center gap-4 text-sm text-slate-600">
              <button className="flex items-center gap-1 hover:text-red-600 transition-colors">
                <Heart className="w-4 h-4" />
                {post.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                {post.comments}
              </button>
              <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}