import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Share2, Heart, Check, Users, ShieldCheck } from 'lucide-react';
import { EventInfo } from '../types';

interface HeroSectionProps {
  eventInfo: EventInfo;
  totalRSVPs: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ eventInfo, totalRSVPs }) => {
  const [copied, setCopied] = useState(false);

  const handleShareWhatsApp = () => {
    const inviteMsg = `💐 *Farewell Party Invitation* 💐\n\nHonouring *Yashvir Singh Sir* & *Suresh Kumar Sir*\n\n📅 *Date:* 30.10.2026 (Friday)\n⏰ *Time:* 12:00 PM Noon\n📍 *Venue:* CHQ, Faridabad\n\n🍲 Please fill your Biryani food choice (Veg or Non-Veg) here so host can order:\n${window.location.href}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteMsg)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-50 py-10 border-b border-amber-800/60 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center space-y-4">
        {/* Event Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-800/80 border border-amber-600/60 text-amber-300 text-xs font-semibold tracking-wide">
          <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Farewell Party Honor</span>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-amber-100 tracking-tight leading-snug">
          Farewell Party for <br className="hidden sm:inline" />
          <span className="text-amber-400">Yashvir Singh Sir</span> &amp; <span className="text-amber-400">Suresh Kumar Sir</span>
        </h1>

        <p className="text-sm sm:text-base text-amber-200/90 max-w-2xl mx-auto leading-relaxed">
          Please add your name and select whether you prefer <strong>Veg Biryani</strong> or <strong>Non-Veg Biryani</strong>. All member choices are stored live so the host can order exact food quantities.
        </p>

        {/* Key Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-2 text-left">
          <div className="bg-amber-950/80 border border-amber-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">Date</div>
              <div className="text-xs font-bold text-amber-100">30.10.2026</div>
            </div>
          </div>

          <div className="bg-amber-950/80 border border-amber-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">Time</div>
              <div className="text-xs font-bold text-amber-100">12:00 PM Noon</div>
            </div>
          </div>

          <div className="bg-amber-950/80 border border-amber-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">Venue</div>
              <div className="text-xs font-bold text-amber-100 truncate">CHQ, Faridabad</div>
            </div>
          </div>
        </div>

        {/* Share Link Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleShareWhatsApp}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/60 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm"
          >
            <Share2 className="w-4 h-4 text-emerald-200" />
            <span>Share Link on WhatsApp</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 bg-amber-900/80 hover:bg-amber-800 border border-amber-700/80 text-amber-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Link Copied!</span>
              </>
            ) : (
              <span>Copy Website Link</span>
            )}
          </button>
        </div>

        {/* Live Data Note */}
        <div className="text-[11px] text-amber-300/80 pt-1 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Web Restored Database: Choices automatically update in real-time for host &amp; members.</span>
        </div>
      </div>
    </div>
  );
};
