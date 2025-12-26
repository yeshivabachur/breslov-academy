import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle, Target, Award, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function PredictiveAnalytics({ studentData }) {
  const predictions = {
    completion_probability: 78,
    at_risk: false,
    predicted_completion_date: '2025-02-15',
    engagement_trend: 'increasing',
    recommended_actions: [
      'Schedule study session for tomorrow',
      'Review last week\'s material',
      'Join upcoming live Q&A'
    ]
  };

  const engagementTrend = [
    { week: 'W1', score: 65, predicted: 65 },
    { week: 'W2', score: 72, predicted: 70 },
    { week: 'W3', score: 78, predicted: 75 },
    { week: 'W4', score: 85, predicted: 80 },
    { week: 'W5', score: null, predicted: 85 },
    { week: 'W6', score: null, predicted: 88 },
    { week: 'W7', score: null, predicted: 90 }
  ];

  return (
    <div className="space-y-6">
      {/* Predictions Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass-effect border-0 premium-shadow rounded-2xl">
          <CardContent className="p-6 text-center">
            <Brain className="w-10 h-10 text-purple-600 mx-auto mb-3" />
            <div className="text-4xl font-black text-slate-900 mb-2">
              {predictions.completion_probability}%
            </div>
            <div className="text-sm text-slate-600 font-serif">Completion Probability</div>
            <Progress value={predictions.completion_probability} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 premium-shadow rounded-2xl">
          <CardContent className="p-6 text-center">
            <Target className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <div className="text-xl font-black text-slate-900 mb-2">
              {new Date(predictions.predicted_completion_date).toLocaleDateString()}
            </div>
            <div className="text-sm text-slate-600 font-serif">Predicted Completion</div>
          </CardContent>
        </Card>

        <Card className={`glass-effect border-0 premium-shadow rounded-2xl ${
          predictions.at_risk ? 'ring-2 ring-red-500' : ''
        }`}>
          <CardContent className="p-6 text-center">
            {predictions.at_risk ? (
              <>
                <AlertTriangle className="w-10 h-10 text-red-600 mx-auto mb-3" />
                <div className="text-xl font-black text-red-600 mb-2">At Risk</div>
                <div className="text-sm text-slate-600 font-serif">Needs Intervention</div>
              </>
            ) : (
              <>
                <Award className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <div className="text-xl font-black text-green-600 mb-2">On Track</div>
                <div className="text-sm text-slate-600 font-serif">Excellent Progress</div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Engagement Forecast */}
      <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Engagement Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementTrend}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" />
            </AreaChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="text-slate-600 font-serif">Actual Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded border-2 border-dashed border-purple-700" />
              <span className="text-slate-600 font-serif">AI Prediction</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card className="glass-effect border-0 premium-shadow-lg rounded-[2rem]">
        <CardContent className="p-6">
          <h4 className="font-bold text-slate-900 mb-4 font-serif">AI Recommendations</h4>
          <div className="space-y-3">
            {predictions.recommended_actions.map((action, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {idx + 1}
                </div>
                <span className="text-slate-900 font-serif">{action}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}