import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ThumbsUp, Reply, Pin, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForumThread({ thread, onReply, onLike }) {
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = () => {
    if (replyText.trim()) {
      onReply?.(thread.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {thread.isPinned && (
                <Pin className="w-4 h-4 text-amber-600" />
              )}
              <h3 className="text-xl font-black text-slate-900">{thread.title}</h3>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-blue-100 text-blue-800">{thread.category}</Badge>
              <div className="text-sm text-slate-600">
                by {thread.author} • {new Date(thread.created).toLocaleDateString()}
              </div>
              {thread.isInstructor && (
                <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Instructor
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed">{thread.content}</p>
        </div>

        {thread.contentHebrew && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-amber-900 font-serif leading-relaxed" dir="rtl">
              {thread.contentHebrew}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike?.(thread.id)}
            className="rounded-lg"
          >
            <ThumbsUp className={`w-4 h-4 mr-2 ${thread.liked ? 'fill-blue-600 text-blue-600' : ''}`} />
            {thread.likes || 0}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="rounded-lg"
          >
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
          <div className="flex items-center gap-1 text-sm text-slate-600 ml-auto">
            <MessageCircle className="w-4 h-4" />
            <span>{thread.replies?.length || 0} replies</span>
          </div>
        </div>

        {showReplyForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Share your thoughts..."
              className="min-h-[100px] rounded-xl"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowReplyForm(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReply}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg"
              >
                Post Reply
              </Button>
            </div>
          </motion.div>
        )}

        {thread.replies && thread.replies.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-200">
            {thread.replies.map((reply, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="ml-8 p-4 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-slate-900">{reply.author}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(reply.created).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-700">{reply.content}</p>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}