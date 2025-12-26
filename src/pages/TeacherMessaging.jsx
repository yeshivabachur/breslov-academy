import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeacherMessaging() {
  const [user, setUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

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

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', user?.email],
    queryFn: () => base44.entities.Message.filter({ recipient_email: user.email }),
    enabled: !!user?.email
  });

  const conversations = messages.reduce((acc, msg) => {
    const key = msg.sender_email;
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});

  return (
    <div className="min-h-screen gradient-mesh bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-600 text-lg">Communicate with your students</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
            <CardContent className="p-6 space-y-3">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search conversations..." className="pl-10 rounded-xl" />
              </div>

              {Object.keys(conversations).map((email, idx) => (
                <motion.button
                  key={email}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedConversation(email)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${
                    selectedConversation === email
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {email[0].toUpperCase()}
                    </div>
                    <div className="font-bold text-slate-900 text-sm">{email}</div>
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-1">
                    {conversations[email][0]?.content}
                  </div>
                </motion.button>
              ))}
            </CardContent>
          </Card>

          {/* Message Thread */}
          <Card className="md:col-span-2 glass-effect border-0 premium-shadow-lg rounded-[2rem] h-[600px] flex flex-col">
            <CardContent className="flex-1 flex flex-col p-6 gap-4">
              {selectedConversation ? (
                <>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    <AnimatePresence>
                      {conversations[selectedConversation]?.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.sender_email === user?.email ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.sender_email === user?.email
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'bg-white text-slate-900'
                          }`}>
                            <p className="text-sm">{msg.content}</p>
                            <span className={`text-xs ${msg.sender_email === user?.email ? 'text-white/70' : 'text-slate-500'}`}>
                              {new Date(msg.created_date).toLocaleTimeString()}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 rounded-xl resize-none"
                      rows={2}
                    />
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                    <p>Select a conversation to view messages</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}