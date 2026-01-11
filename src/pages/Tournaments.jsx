import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/components/hooks/useSession';
import { buildCacheKey, scopedList, scopedUpdate } from '@/components/api/scoped';

export default function Tournaments() {
  const { user, activeSchoolId } = useSession();
  const queryClient = useQueryClient();

  const { data: tournaments = [] } = useQuery({
    queryKey: buildCacheKey('tournaments', activeSchoolId),
    queryFn: () => scopedList('Tournament', activeSchoolId, '-start_date'),
    enabled: !!activeSchoolId
  });

  const joinMutation = useMutation({
    mutationFn: async (tournament) => {
      const participants = tournament.participants || [];
      return await scopedUpdate('Tournament', tournament.id, {
        participants: [...participants, user.email]
      }, activeSchoolId, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('tournaments', activeSchoolId));
      toast.success('Joined tournament!');
    }
  });

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-amber-900 to-orange-900 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <Trophy className="w-16 h-16" />
          <div>
            <h1 className="text-4xl font-bold mb-2">Tournaments</h1>
            <p className="text-amber-200 text-lg">Compete for glory and prizes!</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tournaments.map((tournament) => (
          <Card key={tournament.id} className="hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{tournament.name}</h3>
                  <Badge>{tournament.type}</Badge>
                </div>
                <Trophy className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-slate-600 mb-4">{tournament.description}</p>
              <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                <span>Starts: {new Date(tournament.start_date).toLocaleDateString()}</span>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{tournament.participants?.length || 0} joined</span>
                </div>
              </div>
              <Button
                onClick={() => joinMutation.mutate(tournament)}
                disabled={tournament.participants?.includes(user?.email)}
                className="w-full"
              >
                {tournament.participants?.includes(user?.email) ? 'Joined' : 'Join Tournament'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
