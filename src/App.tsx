import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { RSVPForm } from './components/RSVPForm';
import { LiveStats } from './components/LiveStats';
import { GuestListTable } from './components/GuestListTable';
import { RSVP, SummaryStats, EventInfo } from './types';
import { CheckCircle2, Heart } from 'lucide-react';

const CLOUD_SYNC_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a186ea527c4985';
const LOCAL_STORAGE_KEY = 'farewell_biryani_rsvps_v5';

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

  // Fetch live choices from Cloud Central Sync URL first, fallback to Express or LocalStorage
  const fetchRSVPData = async () => {
    try {
      const res = await fetch(CLOUD_SYNC_URL);
      if (res.ok) {
        const cloudObj = await res.json();
        if (cloudObj && cloudObj.data && Array.isArray(cloudObj.data.rsvps)) {
          const list: RSVP[] = cloudObj.data.rsvps;
          setRsvps(list);
          setStats(calculateStats(list));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
          return;
        }
      }
    } catch (err) {
      console.warn('Cloud sync read failed, trying local server/storage:', err);
    }

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
      // Offline fallback
    }

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: RSVP[] = JSON.parse(stored);
        setRsvps(parsed);
        setStats(calculateStats(parsed));
      }
    } catch (err) {
      console.error('Failed to load storage:', err);
    }
  };

  useEffect(() => {
    fetchRSVPData();
    // Poll every 3 seconds so choices across devices sync instantly
    const interval = setInterval(fetchRSVPData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Merge new submission into Central Cloud Database
  const handleRsvpSuccess = async (newRsvp: RSVP) => {
    const msg = newRsvp.attending
      ? `Choice saved for ${newRsvp.name} (${
          newRsvp.foodChoice === 'veg' ? 'Veg Biryani' : 'Non-Veg Biryani'
        })`
      : `Response saved for ${newRsvp.name} (Not Attending)`;

    setSubmittedMessage(msg);

    let latestCloudList: RSVP[] = [];

    // Fetch latest cloud entries first to avoid overwriting existing guest entries
    try {
      const getRes = await fetch(CLOUD_SYNC_URL);
      if (getRes.ok) {
        const cloudObj = await getRes.json();
        if (cloudObj && cloudObj.data && Array.isArray(cloudObj.data.rsvps)) {
          latestCloudList = cloudObj.data.rsvps;
        }
      }
    } catch (err) {
      console.warn('Could not fetch latest cloud list before saving, using local:', err);
      latestCloudList = rsvps;
    }

    // Merge by name & ID so duplicate entries update cleanly
    const merged = [
      newRsvp,
      ...latestCloudList.filter(
        (r) => r.id !== newRsvp.id && r.name.toLowerCase() !== newRsvp.name.toLowerCase()
      ),
    ];

    setRsvps(merged);
    setStats(calculateStats(merged));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));

    // Save Merged List to Central Cloud DB
    try {
      await fetch(CLOUD_SYNC_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Faridabad Farewell RSVPs',
          data: { rsvps: merged },
        }),
      });
    } catch (err) {
      console.error('Cloud save failed:', err);
    }

    // Also sync with Express server if available
    try {
      await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRsvp),
      });
    } catch (err) {
      // Local server unavailable on static host
    }

    fetchRSVPData();

    setTimeout(() => {
      setSubmittedMessage(null);
    }, 4000);
  };

  const handleDeleteRsvp = async (id: string) => {
    let latestCloudList: RSVP[] = rsvps;

    try {
      const getRes = await fetch(CLOUD_SYNC_URL);
      if (getRes.ok) {
        const cloudObj = await getRes.json();
        if (cloudObj && cloudObj.data && Array.isArray(cloudObj.data.rsvps)) {
          latestCloudList = cloudObj.data.rsvps;
        }
      }
    } catch (err) {
      // fallback
    }

    const updated = latestCloudList.filter((r) => r.id !== id);
    setRsvps(updated);
    setStats(calculateStats(updated));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    try {
      await fetch(CLOUD_SYNC_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Faridabad Farewell RSVPs',
          data: { rsvps: updated },
        }),
      });
    } catch (err) {
      console.error('Cloud delete failed:', err);
    }

    try {
      await fetch(`/api/rsvps/${id}`, { method: 'DELETE' });
    } catch (err) {
      // Offline fallback
    }
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
            🌐 Live Cloud Sync Active · 📅 30.10.2026 @ 12:00 PM Noon · CHQ, Faridabad
          </div>
        </div>
      </footer>
    </div>
  );
}
