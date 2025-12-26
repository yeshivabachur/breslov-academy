import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, ThumbsUp, Share2, Pin, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommunitySpace({ spaceName, members, posts, onPost, userEmail }) {
  const [newPost, setNewPost] = useState('');
  const [filter, setFilter] = useState('recent');

  const sortedPosts = [...(posts || [])].sort((a, b) => {
    if (filter === 'popular') return (b.likes || 0) - (a.likes || 0);
    return new Date(b.created_date) - new Date(a.created_date);
  });

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem] overflow-hidden">
        <div className="h-40 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 flex items-center">
          <div>
            <Badge className="bg-white/20 text-white mb-2 font-serif">Community</Badge>
            <h2 className="text-4xl font-black text-white font-serif mb-2">{spaceName}</h2>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {members?.length || 0} members
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {posts?.length || 0} posts
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Create Post */}
      <Card className="glass-effect border-0 premium-shadow-lg rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your learning insights with the community..."
            className="min-h-[100px] rounded-xl font-serif"
          />
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl">
                <Share2 className="w-4 h-4 mr-2" />
                Add Media
              </Button>
            </div>
            <Button
              onClick={() => {
                onPost?.({ content: newPost, user_email: userEmail });
                setNewPost('');
              }}
              disabled={!newPost.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-serif"
            >
              Post to Community
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex gap-2">
        <Button
          onClick={() => setFilter('recent')}
          variant={filter === 'recent' ? 'default' : 'outline'}
          size="sm"
          className="rounded-xl font-serif"
        >
          Recent
        </Button>
        <Button
          onClick={() => setFilter('popular')}
          variant={filter === 'popular' ? 'default' : 'outline'}
          size="sm"
          className="rounded-xl font-serif"
        >
          Popular
        </Button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {sortedPosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author_name?.[0] || 'S'}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-slate-900 font-serif">{post.author_name}</span>
                      {post.is_instructor && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Crown className="w-3 h-3 mr-1" />
                          Rebbe
                        </Badge>
                      )}
                      {post.is_pinned && <Pin className="w-4 h-4 text-amber-600" />}
                      <span className="text-sm text-slate-500">
                        {new Date(post.created_date).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-slate-700 font-serif leading-relaxed mb-4">
                      {post.content}
                    </p>

                    {post.media_urls && (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {post.media_urls.map((url, i) => (
                          <img key={i} src={url} className="rounded-xl w-full" alt="" />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes || 0}
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments_count || 0} comments
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}