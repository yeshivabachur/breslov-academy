import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentPlans({ coursePrice, onSelect }) {
  const [selectedPlan, setSelectedPlan] = useState('full');

  const plans = [
    {
      id: 'full',
      name: 'Full Payment',
      price: coursePrice,
      savings: coursePrice * 0.1,
      badge: 'Save 10%',
      popular: true
    },
    {
      id: '3month',
      name: '3 Monthly Payments',
      price: coursePrice / 3,
      total: coursePrice * 1.05,
      note: 'Small 5% processing fee'
    },
    {
      id: '6month',
      name: '6 Monthly Payments',
      price: coursePrice / 6,
      total: coursePrice * 1.1,
      note: '10% total processing fee'
    }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-8 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-black text-slate-900 font-serif mb-2">Choose Your Payment Plan</h3>
          <p className="text-slate-600 font-serif">Flexible options to make Torah learning accessible</p>
        </div>

        <div className="space-y-3">
          {plans.map((plan, idx) => {
            const isSelected = selectedPlan === plan.id;
            
            return (
              <motion.button
                key={plan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                } ${plan.popular ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg text-slate-900 font-serif">{plan.name}</h4>
                      {plan.popular && (
                        <Badge className="bg-green-500 text-white">Most Popular</Badge>
                      )}
                      {plan.badge && (
                        <Badge className="bg-amber-100 text-amber-800">{plan.badge}</Badge>
                      )}
                    </div>
                    {plan.note && (
                      <p className="text-sm text-slate-600 font-serif">{plan.note}</p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-black text-slate-900">
                      ${plan.price.toFixed(2)}
                    </div>
                    {plan.id !== 'full' && (
                      <div className="text-sm text-slate-600">/month</div>
                    )}
                  </div>
                </div>

                {plan.total && (
                  <div className="text-sm text-slate-600 font-serif">
                    Total: ${plan.total.toFixed(2)}
                  </div>
                )}

                {plan.savings && (
                  <div className="flex items-center gap-2 mt-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-bold">Save ${plan.savings.toFixed(2)}</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <Button
          onClick={() => onSelect?.(selectedPlan)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-6 rounded-2xl font-serif"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Continue to Checkout
        </Button>

        <div className="text-center text-xs text-slate-600 font-serif">
          30-day money-back guarantee • Secure payment processing
        </div>
      </CardContent>
    </Card>
  );
}