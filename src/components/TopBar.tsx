import React from 'react';
import { ChefHat, Sparkles, Heart } from 'lucide-react';

interface TopBarProps {
  attendingCount: number;
  vegCount: number;
  nonVegCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({ attendingCount, vegCount, nonVegCount }) => {
  return (
    <header className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 border-b border-amber-600/40 text-amber-50 shadow-xl relative z-20">
      {/* Top Glossy Highlight Line */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Event Wordmark & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 font-serif font-black text-xl flex items-center justify-center shadow-md shadow-amber-950/60 border border-amber-300/80 shrink-0">
            <ChefHat className="w-6 h-6 text-amber-950" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-amber-100 text-base sm:text-lg tracking-tight leading-snug flex items-center gap-2">
              <span>Farewell Party for</span>
              <span className="text-amber-300 font-extrabold underline decoration-amber-400 decoration-2 underline-offset-2">
                Yashvir Singh Sir
              </span>
              <span>&amp;</span>
              <span className="text-amber-300 font-extrabold underline decoration-amber-400 decoration-2 underline-offset-2">
                Suresh Kumar Sir
              </span>
            </h1>
            <div className="text-xs text-amber-200/90 flex items-center gap-2 font-medium">
              <span className="bg-amber-900/80 px-2 py-0.5 rounded border border-amber-700/60 font-mono">
                📅 30.10.2026 @ 12:00 PM Noon
              </span>
              <span>·</span>
              <span className="text-amber-300 font-semibold">📍 CHQ, Faridabad</span>
            </div>
          </div>
        </div>

        {/* Glossy 3D Live Status Badges */}
        <div className="flex items-center gap-2 font-mono text-xs shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-amber-800 to-amber-900 border-t border-amber-600 border-b-2 border-b-amber-950 text-amber-100 font-bold shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Attending: {attendingCount}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-emerald-800 to-emerald-950 border-t border-emerald-500 border-b-2 border-b-emerald-950 text-emerald-200 font-bold shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Veg: {vegCount}</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-gradient-to-b from-orange-800 to-amber-950 border-t border-orange-500 border-b-2 border-b-orange-950 text-orange-200 font-bold shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Non-Veg: {nonVegCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
