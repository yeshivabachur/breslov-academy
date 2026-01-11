import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from '@/components/hooks/useSession';
import { buildCacheKey, scopedCreate, scopedFilter, scopedUpdate } from '@/components/api/scoped';

export default function RewardsShop() {
  const { user, activeSchoolId } = useSession();
  const [myPoints, setMyPoints] = useState(0);
  const queryClient = useQueryClient();

  const { data: rewards = [] } = useQuery({
    queryKey: buildCacheKey('rewards', activeSchoolId),
    queryFn: () => scopedFilter('Reward', activeSchoolId, { is_available: true }),
    enabled: !!activeSchoolId
  });

  const { data: leaderboard } = useQuery({
    queryKey: buildCacheKey('my-points', activeSchoolId, user?.email),
    queryFn: async () => {
      const leaders = await scopedFilter('Leaderboard', activeSchoolId, { user_email: user.email });
      return leaders[0];
    },
    enabled: !!user?.email && !!activeSchoolId
  });

  useEffect(() => {
    if (leaderboard) setMyPoints(leaderboard.total_points || 0);
  }, [leaderboard]);

  const redeemMutation = useMutation({
    mutationFn: async (reward) => {
      await scopedUpdate('Reward', reward.id, {
        claimed_count: (reward.claimed_count || 0) + 1,
        stock: reward.stock ? reward.stock - 1 : null
      }, activeSchoolId, true);
      await scopedUpdate('Leaderboard', leaderboard.id, {
        total_points: myPoints - reward.cost_points
      }, activeSchoolId, true);
      try {
        await scopedCreate('AuditLog', activeSchoolId, {
          user_email: user?.email,
          action: 'REWARD_REDEEMED',
          entity_type: 'Reward',
          entity_id: reward.id,
          metadata: {
            reward_name: reward.name,
            cost_points: reward.cost_points,
            points_before: myPoints,
            points_after: myPoints - reward.cost_points
          }
        });
      } catch (error) {
        // Best-effort audit logging.
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(buildCacheKey('rewards', activeSchoolId));
      queryClient.invalidateQueries(buildCacheKey('my-points', activeSchoolId, user?.email));
      toast.success('Reward redeemed!');
    }
  });

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-pink-900 to-rose-900 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ShoppingBag className="w-16 h-16" />
            <div>
              <h1 className="text-4xl font-bold mb-2">Rewards Shop</h1>
              <p className="text-pink-200 text-lg">Redeem your points for awesome rewards</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl p-6 text-center">
            <p className="text-sm text-pink-200 mb-1">Your Points</p>
            <p className="text-5xl font-bold flex items-center">
              <Star className="w-10 h-10 mr-2" />
              {myPoints.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rewards.map((reward) => {
          const canAfford = myPoints >= reward.cost_points;
          const inStock = !reward.stock || reward.stock > 0;

          return (
            <Card key={reward.id} className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="text-5xl mb-4 text-center">{reward.icon || '🎁'}</div>
                <Badge className="mb-2">{reward.type}</Badge>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{reward.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{reward.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-600 font-bold">
                    <Star className="w-5 h-5 mr-1" />
                    {reward.cost_points}
                  </div>
                  {reward.stock && (
                    <span className="text-xs text-slate-500">{reward.stock} left</span>
                  )}
                </div>

                <Button
                  onClick={() => redeemMutation.mutate(reward)}
                  disabled={!canAfford || !inStock}
                  className="w-full mt-4"
                >
                  {!inStock ? 'Out of Stock' : !canAfford ? 'Not Enough Points' : 'Redeem'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
