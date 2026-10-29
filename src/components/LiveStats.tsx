import React from 'react';
import { SummaryStats } from '../types';
import { Leaf, Flame, Users, CheckCircle2 } from 'lucide-react';

interface LiveStatsProps {
  stats: SummaryStats;
}

export const LiveStats: React.FC<LiveStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-2 text-center text-xs">
      <div className="bg-amber-100/80 border border-amber-300 rounded-lg p-1.5">
        <span className="text-[10px] font-bold text-amber-900 uppercase block">Physically Attending</span>
        <span className="text-base font-bold font-mono text-amber-950">{stats.attendingCount}</span>
      </div>

      <div className="bg-emerald-100/80 border border-emerald-300 rounded-lg p-1.5">
        <span className="text-[10px] font-bold text-emerald-900 uppercase block">Veg Biryani</span>
        <span className="text-base font-bold font-mono text-emerald-950">{stats.vegPortions}</span>
      </div>

      <div className="bg-orange-100/80 border border-orange-300 rounded-lg p-1.5">
        <span className="text-[10px] font-bold text-orange-900 uppercase block">Non-Veg Biryani</span>
        <span className="text-base font-bold font-mono text-orange-950">{stats.nonVegPortions}</span>
      </div>
    </div>
  );
};
