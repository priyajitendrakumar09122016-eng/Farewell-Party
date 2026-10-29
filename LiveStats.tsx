import React from 'react';
import { SummaryStats } from '../types';
import { Users, Flame, Leaf, PieChart } from 'lucide-react';

interface LiveStatsProps {
  stats: SummaryStats;
}

export const LiveStats: React.FC<LiveStatsProps> = ({ stats }) => {
  const total = stats.totalRSVPs || 1;
  const vegPct = Math.round((stats.vegPortions / total) * 100);
  const nonVegPct = Math.round((stats.nonVegPortions / total) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 max-w-xl mx-auto my-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-600" />
            <span>Total Food Choices Restored on Web</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Updated in real-time as members fill the form
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-slate-900">
            {stats.totalRSVPs}
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-500">
            Total Members
          </div>
        </div>
      </div>

      {/* Visual Dual Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1 text-emerald-800">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>Veg Biryani: {stats.vegPortions} ({vegPct}%)</span>
          </span>
          <span className="flex items-center gap-1 text-amber-900">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Non-Veg Biryani: {stats.nonVegPortions} ({nonVegPct}%)</span>
          </span>
        </div>

        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
          <div
            style={{ width: `${vegPct}%` }}
            className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
            title={`Veg: ${stats.vegPortions}`}
          />
          <div
            style={{ width: `${nonVegPct}%` }}
            className="bg-amber-600 h-full rounded-r-full transition-all duration-500"
            title={`Non-Veg: ${stats.nonVegPortions}`}
          />
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
          <span className="text-emerald-800 font-bold text-xs uppercase block">Veg Biryani</span>
          <span className="text-2xl font-bold font-mono text-emerald-950 mt-1 block">
            {stats.vegPortions}
          </span>
          <span className="text-[10px] text-emerald-700/80">Portions Required</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
          <span className="text-amber-900 font-bold text-xs uppercase block">Non-Veg Biryani</span>
          <span className="text-2xl font-bold font-mono text-amber-950 mt-1 block">
            {stats.nonVegPortions}
          </span>
          <span className="text-[10px] text-amber-800/80">Portions Required</span>
        </div>
      </div>
    </div>
  );
};
