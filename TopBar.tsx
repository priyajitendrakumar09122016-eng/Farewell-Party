import React from 'react';
import { Heart, Users, Utensils } from 'lucide-react';

interface TopBarProps {
  totalCount: number;
  vegCount: number;
  nonVegCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({ totalCount, vegCount, nonVegCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-amber-950/95 backdrop-blur-md border-b border-amber-900/60 text-amber-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand / Event Wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-amber-950 flex items-center justify-center font-bold font-serif text-base shrink-0">
            F
          </div>
          <div className="truncate">
            <h1 className="font-serif font-bold text-amber-100 text-sm sm:text-base leading-snug truncate">
              Farewell Party · CHQ Faridabad
            </h1>
            <p className="text-[11px] text-amber-300/80 truncate">
              Yashvir Singh Sir & Suresh Kumar Sir
            </p>
          </div>
        </div>

        {/* Live Counters Pill */}
        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2.5 py-1 rounded-lg">
            Veg: {vegCount}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 bg-amber-900/80 text-amber-200 border border-amber-700/60 px-2.5 py-1 rounded-lg">
            Non-Veg: {nonVegCount}
          </span>
          <span className="bg-amber-500 text-amber-950 font-bold px-3 py-1 rounded-lg shadow-sm">
            Total: {totalCount}
          </span>
        </div>
      </div>
    </header>
  );
};
