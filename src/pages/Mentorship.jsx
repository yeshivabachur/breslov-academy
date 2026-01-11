import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/components/hooks/useSession';
import { buildCacheKey, scopedCreate, scopedFilter } from '@/components/api/scoped';

export default function Mentorship() {
  const { user, activeSchoolId } = useSession();
  const queryClient = useQueryClient();

  const { data: myMentorships = [] } = useQuery({
    queryKey: buildCacheKey('mentorships', activeSchoolId, user?.email),
    queryFn: async () => {
      const asMentee = await scopedFilter('Mentorship', activeSchoolId, { mentee_email: user.email });
      const asMentor = await scopedFilter('Mentorship', activeSchoolId, { mentor_email: user.email });
      return [...asMentee, ...asMentor];
    },
    enabled: !!user?.email && !!activeSchoolId
  });

  const { data: availableMentors = [] } = useQuery({
    queryKey: ['available-mentors', activeSchoolId],
    queryFn: () => scopedFilter('SchoolMembership', activeSchoolId, { role: { $in: ['INSTRUCTOR', 'ADMIN', 'OWNER'] } }),
    enabled: !!activeSchoolId
  });

  const requestMutation = useMutation({
    mutationFn: async (mentorEmail) => {
      return await scopedCreate('Mentorship', activeSchoolId, {
        mentor_email: mentorEmail,
        mentee_email: user.email,
        status: 'requested'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('mentorships', activeSchoolId, user?.email));
      toast.success('Mentorship requested!');
    }
  });

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <Users className="w-16 h-16" />
          <div>
            <h1 className="text-4xl font-bold mb-2">Mentorship Program</h1>
            <p className="text-indigo-200 text-lg">Connect with experienced Torah scholars</p>
          </div>
        </div>
      </div>

      {myMentorships.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Mentorships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myMentorships.map((mentorship) => (
              <Card key={mentorship.id}>
                <CardContent className="p-6">
                  <Badge className="mb-3">{mentorship.status}</Badge>
                  <h3 className="font-bold text-lg mb-2">
                    {mentorship.mentor_email === user?.email ? 'Mentee' : 'Mentor'}: 
                    {mentorship.mentor_email === user?.email ? mentorship.mentee_email : mentorship.mentor_email}
                  </h3>
                  <p className="text-slate-600 text-sm mb-3">
                    {mentorship.meetings_completed} meetings completed
                  </p>
                  {mentorship.next_meeting && (
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Next: {new Date(mentorship.next_meeting).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Available Mentors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">{mentor.user_email?.split('@')[0] || 'Mentor'}</h3>
                <p className="text-slate-600 text-sm mb-1">{mentor.user_email}</p>
                <p className="text-xs text-slate-500 mb-4">{mentor.role}</p>
                <Button
                  onClick={() => requestMutation.mutate(mentor.user_email)}
                  className="w-full"
                >
                  Request Mentorship
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
