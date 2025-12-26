import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, Pin, Lock, TrendingUp, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdvancedForum({ threads, onCreateThread, onReply, userEmail }) {
  const [newThread, setNewThread] = useState({ title: '', content: '', tags: [] });
  const [showNewThread, setShowNewThread] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  const sortedThreads = [...(threads || [])].sort((a, b) => {
    if (sortBy === 'popular') return (b.upvotes || 0) - (a.upvotes || 0);
    if (sortBy === 'recent') return new Date(b.created_date) - new Date(a.created_date);
    return 0;
  });

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-slate-900">Discussion Forum</h2>
            <Button
              onClick={() => setShowNewThread(!showNewThread)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              New Thread
            </Button>
          </div>

          {showNewThread && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-blue-50 rounded-xl space-y-3 mb-4"
            >
              <Input
                value={newThread.title}
                onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                placeholder="Thread title..."
                className="rounded-xl bg-white"
              />
              <Textarea
                value={newThread.content}
                onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                placeholder="Start a discussion..."
                className="rounded-xl bg-white"
                rows={4}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    onCreateThread?.(newThread);
                    setNewThread({ title: '', content: '', tags: [] });
                    setShowNewThread(false);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
                >
                  Post Thread
                </Button>
                <Button
                  onClick={() => setShowNewThread(false)}
                  variant="outline"
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setSortBy('recent')}
              variant={sortBy === 'recent' ? 'default' : 'outline'}
              size="sm"
              className="rounded-xl"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Recent
            </Button>
            <Button
              onClick={() => setSortBy('popular')}
              variant={sortBy === 'popular' ? 'default' : 'outline'}
              size="sm"
              className="rounded-xl"
            >
              <Award className="w-4 h-4 mr-2" />
              Popular
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {sortedThreads.map((thread, idx) => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <Card className="glass-effect border-0 premium-shadow hover:premium-shadow-lg transition-all rounded-2xl cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {thread.author_name?.[0] || 'S'}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      {thread.is_pinned && <Pin className="w-4 h-4 text-amber-600 mt-1" />}
                      {thread.is_locked && <Lock className="w-4 h-4 text-slate-400 mt-1" />}
                      <h3 className="font-bold text-lg text-slate-900 flex-1">{thread.title}</h3>
                    </div>

                    <p className="text-slate-600 mb-3 line-clamp-2">{thread.content}</p>

                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <ThumbsUp className="w-4 h-4" />
                        {thread.upvotes || 0}
                      </button>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {thread.reply_count || 0} replies
                      </div>
                      <div>by {thread.author_name}</div>
                      <div>{new Date(thread.created_date).toLocaleDateString()}</div>
                    </div>

                    {thread.tags && (
                      <div className="flex gap-2 mt-2">
                        {thread.tags.map((tag, i) => (
                          <Badge key={i} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    )}
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