"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Bet } from '@/types';
import { useFormatter } from 'next-intl';

interface BetAnalyticsProps {
  bet: Bet;
}

// Mock data generation
const generateGraphData = (total: number) => {
  const data = [];
  let current = 0;
  for (let i = 0; i < 7; i++) {
    current += Math.random() * (total / 5);
    if (current > total) current = total;
    data.push({
      name: `Day ${i + 1}`,
      amount: Math.round(current),
    });
  }
  return data;
};

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

export const BetAnalytics: React.FC<BetAnalyticsProps> = ({ bet }) => {
  const format = useFormatter();
  
  // Mock distribution data based on bet outcome
  const pieData = [
    { name: 'For', value: Math.round(bet.betsCount * 0.6) },
    { name: 'Against', value: Math.round(bet.betsCount * 0.3) },
    { name: 'Neutral', value: Math.round(bet.betsCount * 0.1) },
  ];

  const graphData = generateGraphData(bet.betAmount);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Pool Growth</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={graphData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="amount" stroke="#3B82F6" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Positions Distribution</h3>
          <div className="flex items-center justify-center" style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
