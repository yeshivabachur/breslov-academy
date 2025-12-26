import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import CommunitySpace from '../components/community/CommunitySpace';
import MemberProfiles from '../components/social/MemberProfiles';

export default function Community() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

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

  const { data: posts = [] } = useQuery({
    queryKey: ['community-posts'],
    queryFn: () => base44.entities.Post.list('-created_date', 50)
  });

  const { data: members = [] } = useQuery({
    queryKey: ['community-members'],
    queryFn: async () => {
      const users = await base44.entities.User.list();
      return users.slice(0, 20);
    }
  });

  const createPostMutation = useMutation({
    mutationFn: (postData) => base44.entities.Post.create({
      ...postData,
      likes: 0,
      comments_count: 0
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['community-posts']);
    }
  });

  return (
    <div className="min-h-screen gradient-mesh bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl">
              <Users className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-slate-900 font-serif">Kehilla</h1>
              <p className="text-xl text-slate-600 font-serif">Torah Learning Community</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="bg-white rounded-2xl p-1 font-serif">
            <TabsTrigger value="feed" className="rounded-xl">Community Feed</TabsTrigger>
            <TabsTrigger value="members" className="rounded-xl">Members</TabsTrigger>
            <TabsTrigger value="groups" className="rounded-xl">Study Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <CommunitySpace
              spaceName="Breslov Torah Learners"
              members={members}
              posts={posts}
              onPost={(data) => createPostMutation.mutate(data)}
              userEmail={user?.email}
            />
          </TabsContent>

          <TabsContent value="members">
            <MemberProfiles
              members={members}
              onConnect={(memberId) => console.log('Connect to', memberId)}
            />
          </TabsContent>

          <TabsContent value="groups">
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-serif mb-4">Study groups coming soon</p>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-serif">
                <Plus className="w-4 h-4 mr-2" />
                Create Study Group
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}