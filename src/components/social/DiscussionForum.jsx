import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, ThumbsUp, Reply, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DiscussionForum({ lessonId }) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sarah Cohen',
      content: 'What a profound insight on hitbodedut! This changed my perspective.',
      likes: 12,
      replies: 3,
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      author: 'David Levy',
      content: 'Can someone explain the concept of Azamra in more detail?',
      likes: 8,
      replies: 5,
      timestamp: '4 hours ago'
    },
  ]);
  const [newPost, setNewPost] = useState('');

  const addPost = () => {
    if (newPost.trim()) {
      setPosts([{
        id: Date.now(),
        author: 'You',
        content: newPost,
        likes: 0,
        replies: 0,
        timestamp: 'Just now'
      }, ...posts]);
      setNewPost('');
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-black text-slate-900">Discussion</h3>
        </div>

        <div className="flex gap-2">
          <Input
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPost()}
            placeholder="Share your thoughts..."
            className="flex-1 rounded-xl"
          />
          <Button
            onClick={addPost}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl p-4 shadow-md"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {post.author[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{post.author}</div>
                      <div className="text-xs text-slate-500">{post.timestamp}</div>
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 mb-3">{post.content}</p>
                <div className="flex gap-4 text-sm text-slate-600">
                  <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <Reply className="w-4 h-4" />
                    <span>{post.replies} replies</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}