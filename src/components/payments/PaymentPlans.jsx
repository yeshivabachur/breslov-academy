import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar } from 'lucide-react';

export default function PaymentPlans({ coursePrice = 199 }) {
  const plans = [
    { name: 'Pay in Full', price: coursePrice, discount: 10, total: coursePrice * 0.9 },
    { name: '3 Payments', payments: 3, price: Math.ceil(coursePrice / 3), total: coursePrice },
    { name: '6 Payments', payments: 6, price: Math.ceil(coursePrice / 6), total: coursePrice }
  ];

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardContent className="p-6 space-y-4">
        <h3 className="font-black text-slate-900 text-xl">Payment Options</h3>

        <div className="space-y-3">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border-2 ${
                idx === 0 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-bold text-slate-900">{plan.name}</div>
                  {plan.payments && (
                    <div className="text-sm text-slate-600">
                      ${plan.price}/month × {plan.payments} months
                    </div>
                  )}
                </div>
                {plan.discount && (
                  <Badge className="bg-green-600 text-white">
                    Save {plan.discount}%
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-black text-slate-900 mb-3">
                ${plan.total}
              </div>
              <Button
                className={`w-full rounded-xl ${
                  idx === 0
                    ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
                }`}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Choose Plan
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}