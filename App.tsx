import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { RSVPForm } from './components/RSVPForm';
import { LiveStats } from './components/LiveStats';
import { GuestListTable } from './components/GuestListTable';
import { RSVP, SummaryStats, EventInfo } from './types';
import { CheckCircle2, Heart, RefreshCw } from 'lucide-react';

export default function App() {
  const [eventInfo, setEventInfo] = useState<EventInfo>({
    title: 'Farewell Party',
    honorees: 'Yashvir Singh Sir & Suresh Kumar Sir',
    date: '30.10.2026 (Friday)',
    time: '12:00 PM Noon',
    locationName: 'CHQ',
    fullAddress: 'CHQ, Faridabad, Haryana',
  });

  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [stats, setStats] = useState<SummaryStats>({
    totalRSVPs: 0,
    vegPortions: 0,
    nonVegPortions: 0,
  });

  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Fetch live choices stored on web server
  const fetchRSVPData = async () => {
    try {
      const [eventRes, rsvpRes] = await Promise.all([
        fetch('/api/event').then((r) => r.json()).catch(() => null),
        fetch('/api/rsvps').then((r) => r.json()).catch(() => null),
      ]);

      if (eventRes) setEventInfo(eventRes);
      if (rsvpRes && rsvpRes.rsvps) {
        setRsvps(rsvpRes.rsvps);
        if (rsvpRes.summary) setStats(rsvpRes.summary);
      }
    } catch (err) {
      console.error('Failed to load live choices:', err);
    }
  };

  useEffect(() => {
    fetchRSVPData();
    // Poll every 5 seconds so anyone on the link sees new choices automatically
    const interval = setInterval(fetchRSVPData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRsvpSuccess = (newRsvp: RSVP) => {
    setSubmittedMessage(`Thank you, ${newRsvp.name}! Your choice of ${newRsvp.foodChoice === 'veg' ? 'Veg Biryani' : 'Non-Veg Biryani'} has been saved.`);
    fetchRSVPData();
    setTimeout(() => {
      setSubmittedMessage(null);
    }, 6000);
  };

  const handleDeleteRsvp = async (id: string) => {
    try {
      await fetch(`/api/rsvps/${id}`, { method: 'DELETE' });
      fetchRSVPData();
    } catch (err) {
      console.error('Failed to delete choice:', err);
      setRsvps(rsvps.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <TopBar
        totalCount={stats.totalRSVPs}
        vegCount={stats.vegPortions}
        nonVegCount={stats.nonVegPortions}
      />

      {/* Main Content */}
      <main className="flex-1 pb-12">
        {/* Hero Banner */}
        <HeroSection eventInfo={eventInfo} totalRSVPs={stats.totalRSVPs} />

        <div className="max-w-4xl mx-auto px-4">
          {/* Success Banner when someone submits */}
          {submittedMessage && (
            <div className="my-4 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-md animate-fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span className="font-bold text-sm">{submittedMessage}</span>
            </div>
          )}

          {/* Form to submit Name & Food Choice */}
          <RSVPForm onSubmitSuccess={handleRsvpSuccess} />

          {/* Live Summary Counters */}
          <LiveStats stats={stats} />

          {/* Live Guest Choices Table */}
          <GuestListTable
            rsvps={rsvps}
            onDeleteRsvp={handleDeleteRsvp}
            onRefresh={fetchRSVPData}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-amber-950 text-amber-200/80 border-t border-amber-900/60 py-6 text-xs text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-1">
          <div className="font-serif font-bold text-amber-100">
            Farewell Party for Yashvir Singh Sir &amp; Suresh Kumar Sir
          </div>
          <div className="text-amber-300/80">
            30.10.2026 at 12 Noon · CHQ, Faridabad
          </div>
        </div>
      </footer>
    </div>
  );
}
