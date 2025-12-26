import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star, Infinity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MembershipTiers({ onSelect, currentTier }) {
  const tiers = [
    {
      id: 'free',
      name: 'Talmid (Student)',
      price: 0,
      period: 'forever',
      icon: Star,
      color: 'from-slate-500 to-slate-600',
      features: [
        'Access to free courses',
        'Community forum access',
        'Weekly newsletter',
        'Basic study tools'
      ]
    },
    {
      id: 'premium',
      name: 'Chaver (Member)',
      price: 29,
      period: 'month',
      icon: Crown,
      color: 'from-blue-500 to-indigo-600',
      popular: true,
      features: [
        'All free tier features',
        'Access to all premium courses',
        'Chavruta AI unlimited',
        'Advanced analytics',
        'Certificate of completion',
        'Live office hours monthly',
        'Downloadable resources'
      ]
    },
    {
      id: 'elite',
      name: 'Mekubal (Master)',
      price: 99,
      period: 'month',
      icon: Infinity,
      color: 'from-purple-500 to-pink-600',
      features: [
        'Everything in Premium',
        'Exclusive master classes',
        '1-on-1 mentorship sessions',
        'Early access to new content',
        'Private community space',
        'Personalized learning paths',
        'Direct Rebbe communication',
        'Lifetime access guarantee',
        'Physical course materials'
      ]
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {tiers.map((tier, idx) => {
        const Icon = tier.icon;
        const isCurrent = currentTier === tier.id;

        return (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <Card className={`card-modern border-white/60 premium-shadow hover:premium-shadow-xl transition-all rounded-[2rem] overflow-hidden ${
              tier.popular ? 'ring-2 ring-blue-500 ring-offset-4 scale-105' : ''
            }`}>
              {tier.popular && (
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
              )}
              
              <CardContent className="p-8 space-y-6">
                {tier.popular && (
                  <Badge className="bg-blue-600 text-white font-serif">
                    Most Popular
                  </Badge>
                )}

                <div className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 font-serif mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-black text-slate-900">${tier.price}</span>
                    {tier.period !== 'forever' && (
                      <span className="text-slate-600">/{tier.period}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 font-serif">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => onSelect?.(tier.id)}
                  disabled={isCurrent}
                  className={`w-full py-6 rounded-2xl font-bold font-serif ${
                    isCurrent 
                      ? 'bg-slate-200 text-slate-500'
                      : `bg-gradient-to-r ${tier.color} text-white hover:shadow-2xl`
                  }`}
                >
                  {isCurrent ? 'Current Plan' : tier.price === 0 ? 'Start Free' : 'Upgrade Now'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}