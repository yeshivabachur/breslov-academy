import React, { useState, useEffect } from 'react';
import PageShell from '@/components/ui/PageShell';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Star, Lock, Gift } from 'lucide-react';
import { db } from '@/lib/db';
import { toast } from 'sonner';

const SHOP_ITEMS = [
  { id: 1, name: 'Streak Freeze', cost: 500, icon: '❄️', type: 'powerup', description: 'Protect your streak for one day missed.' },
  { id: 2, name: 'Double XP Potion', cost: 1000, icon: '🧪', type: 'powerup', description: 'Earn 2x XP for the next 30 minutes.' },
  { id: 3, name: 'Breslov Hoodie', cost: 50000, icon: '👕', type: 'merch', description: 'Premium cotton hoodie with logo.' },
  { id: 4, name: 'Golden Profile Frame', cost: 2500, icon: '🖼️', type: 'cosmetic', description: 'Stand out on the leaderboards.' },
  { id: 5, name: 'Private Tutor Session', cost: 100000, icon: '🎓', type: 'service', description: '30 min zoom with a top scholar.' },
];

export default function RewardsShop() {
  const [user, setUser] = useState(null);

  const refreshUser = () => {
    setUser({ ...db.getUser() });
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const handleBuy = (item) => {
    const success = db.buyItem(item);
    if (success) {
      toast.success(`Purchased ${item.name}!`);
      refreshUser();
    } else {
      toast.error("Insufficient funds");
    }
  };

  if (!user) return <PageShell title="Shop" subtitle="Loading..." />;

  return (
    <PageShell title="Rewards Shop" subtitle={`Balance: ${user.coins} Gems`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SHOP_ITEMS.map((item) => {
          const canAfford = user.coins >= item.cost;
          return (
            <Card key={item.id} className="flex flex-col">
              <CardHeader className="text-center pb-2">
                <div className="text-4xl mb-2">{item.icon}</div>
                <CardTitle>{item.name}</CardTitle>
                <Badge variant="secondary" className="w-fit mx-auto mt-2">
                  {item.type.toUpperCase()}
                </Badge>
              </CardHeader>
              <CardContent className="flex-1 text-center">
                <p className="text-sm text-slate-500">{item.description}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={!canAfford} 
                  variant={canAfford ? 'default' : 'outline'}
                  onClick={() => handleBuy(item)}
                >
                  {canAfford ? (
                    <>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Buy for {item.cost}
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Need {item.cost}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
