import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { RSVPForm } from './components/RSVPForm';
import { LiveStats } from './components/LiveStats';
import { GuestListTable } from './components/GuestListTable';
import { RSVP, SummaryStats, EventInfo } from './types';
import { CheckCircle2, Heart, Sparkles } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'farewell_biryani_rsvps_v3';

export default function App() {
  const [eventInfo, setEventInfo] = useState<EventInfo>({
    title: 'Farewell Party',
    honorees: 'Yashvir Singh Sir & Suresh Kumar Sir',
    date: '30.10.2026 (Friday)',
    time: '12:00 PM Noon',
    locationName: 'CHQ, Faridabad',
  });

  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [stats, setStats] = useState<SummaryStats>({
    totalRSVPs: 0,
    attendingCount: 0,
    vegPortions: 0,
    nonVegPortions: 0,
  });

  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const calculateStats = (list: RSVP[]): SummaryStats => {
    let attending = 0;
    let veg = 0;
    let nonVeg = 0;

    list.forEach((r) => {
      if (r.attending) {
        attending++;
        if (r.foodChoice === 'veg') veg++;
        else if (r.foodChoice === 'non-veg') nonVeg++;
      }
    });

    return {
      totalRSVPs: list.length,
      attendingCount: attending,
      vegPortions: veg,
      nonVegPortions: nonVeg,
    };
  };

  const fetchRSVPData = async () => {
    try {
      const res = await fetch('/api/rsvps');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.rsvps)) {
          setRsvps(data.rsvps);
          setStats(data.summary || calculateStats(data.rsvps));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.rsvps));
          return;
        }
      }
    } catch (err) {
      // Offline / Static host fallback
    }

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: RSVP[] = JSON.parse(stored);
        setRsvps(parsed);
        setStats(calculateStats(parsed));
      } else {
        // Start completely BLANK (0 responses)
        setRsvps([]);
        setStats({ totalRSVPs: 0, attendingCount: 0, vegPortions: 0, nonVegPortions: 0 });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
      }
    } catch (err) {
      console.error('Failed to load storage:', err);
    }
  };

  useEffect(() => {
    fetchRSVPData();
    const interval = setInterval(fetchRSVPData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRsvpSuccess = (newRsvp: RSVP) => {
    const msg = newRsvp.attending
      ? `Choice saved for ${newRsvp.name} (${
          newRsvp.foodChoice === 'veg' ? 'Veg Biryani' : 'Non-Veg Biryani'
        })`
      : `Response saved for ${newRsvp.name} (Not Attending)`;

    setSubmittedMessage(msg);

    const updated = [newRsvp, ...rsvps.filter((r) => r.id !== newRsvp.id)];
    setRsvps(updated);
    setStats(calculateStats(updated));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    fetchRSVPData();

    setTimeout(() => {
      setSubmittedMessage(null);
    }, 4000);
  };

  const handleDeleteRsvp = async (id: string) => {
    try {
      await fetch(`/api/rsvps/${id}`, { method: 'DELETE' });
    } catch (err) {
      // Offline fallback
    }

    const updated = rsvps.filter((r) => r.id !== id);
    setRsvps(updated);
    setStats(calculateStats(updated));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Glossy Bar Header */}
      <TopBar
        attendingCount={stats.attendingCount}
        vegCount={stats.vegPortions}
        nonVegCount={stats.nonVegPortions}
      />

      {/* Main Full Desktop Page Body */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col justify-between space-y-6">
        {/* Success Alert Banner */}
        {submittedMessage && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-extrabold flex items-center gap-3 shadow-xl animate-fade-in shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{submittedMessage}</span>
          </div>
        )}

        {/* Desktop 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form & Live Stats Pill Strip */}
          <div className="lg:col-span-5 space-y-4">
            <RSVPForm onSubmitSuccess={handleRsvpSuccess} />
            <LiveStats stats={stats} />
          </div>

          {/* Right Column: Member Responses Table */}
          <div className="lg:col-span-7">
            <GuestListTable
              rsvps={rsvps}
              onDeleteRsvp={handleDeleteRsvp}
              onRefresh={fetchRSVPData}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-amber-950/90 border-t border-amber-900 text-amber-300/80 py-4 text-xs text-center shrink-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-serif font-bold text-amber-100 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Farewell Party for Yashvir Singh Sir &amp; Suresh Kumar Sir</span>
          </div>
          <div className="text-[11px] font-mono text-amber-300/90">
            📅 30.10.2026 @ 12:00 PM Noon · CHQ, Faridabad
          </div>
        </div>
      </footer>
    </div>
  );
}
