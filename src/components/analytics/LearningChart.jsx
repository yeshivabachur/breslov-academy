import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function LearningChart({ data, type = 'bar' }) {
  const mockData = data || [
    { day: 'Sun', hours: 2.5 },
    { day: 'Mon', hours: 3.2 },
    { day: 'Tue', hours: 1.8 },
    { day: 'Wed', hours: 4.1 },
    { day: 'Thu', hours: 2.9 },
    { day: 'Fri', hours: 3.5 },
    { day: 'Sat', hours: 5.2 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl shadow-xl">
          <p className="font-bold">{payload[0].value} hours</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === 'bar' ? (
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="day" 
                stroke="#64748b"
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <YAxis 
                stroke="#64748b"
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="hours" 
                fill="url(#colorGradient)" 
                radius={[10, 10, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          ) : (
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="day" 
                stroke="#64748b"
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <YAxis 
                stroke="#64748b"
                style={{ fontSize: '12px', fontWeight: '600' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}