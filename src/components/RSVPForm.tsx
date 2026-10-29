import React, { useState } from 'react';
import { FoodChoice, RSVP } from '../types';
import { User, Phone, Leaf, Flame, Send, XCircle, CheckCircle2, Sparkles, Utensils } from 'lucide-react';

interface RSVPFormProps {
  onSubmitSuccess: (rsvp: RSVP) => void;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ onSubmitSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [foodChoice, setFoodChoice] = useState<FoodChoice>('veg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (attending === null) {
      setErrorMsg('Please select whether you will physically attend or not.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        attending,
        foodChoice: attending ? foodChoice : undefined,
      };

      const res = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save choice');
      }

      const data = await res.json();
      setIsSubmitting(false);
      setName('');
      setPhone('');
      setAttending(null);
      onSubmitSuccess(data.rsvp);
    } catch (err) {
      // Fallback local creation
      const fallbackRsvp: RSVP = {
        id: 'rsvp-local-' + Date.now(),
        name: name.trim(),
        phone: phone.trim(),
        attending,
        foodChoice: attending ? foodChoice : undefined,
        submittedAt: new Date().toISOString(),
      };
      setIsSubmitting(false);
      setName('');
      setPhone('');
      setAttending(null);
      onSubmitSuccess(fallbackRsvp);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-amber-50/40 to-amber-100/30 border border-amber-200/90 rounded-2xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative Top Gold Glow */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />

      {/* Form Header */}
      <div className="mb-4 pb-3 border-b border-amber-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500 text-amber-950 font-bold shadow-md shadow-amber-900/20">
            <Utensils className="w-5 h-5 text-amber-950" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-950 leading-tight">
              Submit Your Choice
            </h2>
            <p className="text-xs text-amber-800/80 font-medium">
              Please enter your name &amp; food preference
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Farewell RSVP</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold shadow-sm">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Member Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-950 mb-1">
              Your Full Name <span className="text-red-600 font-black">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-amber-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 shadow-inner transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-950 mb-1">
              Phone / Contact (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-amber-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/30 shadow-inner transition-all"
              />
            </div>
          </div>
        </div>

        {/* Physical Attendance 3D Tactile Buttons */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-950 mb-1.5">
            Will you physically attend the Farewell Party at CHQ, Faridabad? <span className="text-red-600 font-black">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Yes Attending 3D Glossy Button */}
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all transform active:translate-y-1 active:border-b-0 cursor-pointer ${
                attending === true
                  ? 'bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-700 border-t border-emerald-300 border-b-4 border-b-emerald-950 text-white shadow-lg shadow-emerald-900/30 ring-2 ring-emerald-400'
                  : 'bg-gradient-to-b from-white to-slate-100 border border-slate-300 border-b-4 border-b-slate-400 text-slate-800 hover:from-slate-50 hover:to-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Yes, Attending Physically</span>
            </button>

            {/* No Cannot Attend 3D Glossy Button */}
            <button
              type="button"
              onClick={() => setAttending(false)}
              className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all transform active:translate-y-1 active:border-b-0 cursor-pointer ${
                attending === false
                  ? 'bg-gradient-to-b from-rose-600 via-rose-700 to-rose-800 border-t border-rose-400 border-b-4 border-b-rose-950 text-white shadow-lg shadow-rose-900/30 ring-2 ring-rose-400'
                  : 'bg-gradient-to-b from-white to-slate-100 border border-slate-300 border-b-4 border-b-slate-400 text-slate-800 hover:from-slate-50 hover:to-slate-200'
              }`}
            >
              <XCircle className="w-4 h-4 text-white" />
              <span>No, Cannot Attend</span>
            </button>
          </div>
        </div>

        {/* Biryani Choice 3D Cards (Opens ONLY if Attending = true) */}
        {attending === true && (
          <div className="pt-2 border-t border-amber-200 space-y-2 animate-fade-in">
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-950">
              Select Your Choice of Biryani: <span className="text-red-600 font-black">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Veg Biryani 3D Glossy Card */}
              <button
                type="button"
                onClick={() => setFoodChoice('veg')}
                className={`py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all transform active:translate-y-1 active:border-b-0 cursor-pointer ${
                  foodChoice === 'veg'
                    ? 'bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-800 border-t border-emerald-300 border-b-4 border-b-emerald-950 text-white shadow-lg shadow-emerald-950/40 ring-2 ring-emerald-400'
                    : 'bg-gradient-to-b from-white to-emerald-50 border-2 border-emerald-300 border-b-4 border-b-emerald-400 text-emerald-950 hover:bg-emerald-100/50'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-sm leading-tight">Veg Biryani</div>
                  <div className="text-[10px] opacity-90 font-medium">100% Pure Vegetarian</div>
                </div>
              </button>

              {/* Non-Veg Biryani 3D Glossy Card */}
              <button
                type="button"
                onClick={() => setFoodChoice('non-veg')}
                className={`py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all transform active:translate-y-1 active:border-b-0 cursor-pointer ${
                  foodChoice === 'non-veg'
                    ? 'bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 border-t border-amber-300 border-b-4 border-b-amber-950 text-white shadow-lg shadow-amber-950/40 ring-2 ring-amber-400'
                    : 'bg-gradient-to-b from-white to-amber-50 border-2 border-amber-300 border-b-4 border-b-amber-400 text-amber-950 hover:bg-amber-100/50'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-left">
                  <div className="font-extrabold text-sm leading-tight">Non-Veg Biryani</div>
                  <div className="text-[10px] opacity-90 font-medium">Authentic Dum Biryani</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* 3D Glossy Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 border-t border-amber-200 border-b-4 border-b-amber-800 text-amber-950 font-black text-sm rounded-xl shadow-xl shadow-amber-900/30 transition-all transform active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4 text-amber-950" />
          <span>{isSubmitting ? 'Saving Choice...' : 'Submit Food Choice'}</span>
        </button>
      </form>
    </div>
  );
};
