import React, { useState } from 'react';
import { FoodChoice, RSVP } from '../types';
import { User, Phone, CheckCircle2, Leaf, Flame, Send } from 'lucide-react';

interface RSVPFormProps {
  onSubmitSuccess: (rsvp: RSVP) => void;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({ onSubmitSuccess }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
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

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        foodChoice,
      };

      const res = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Server returned an error while saving choice.');
      }

      const data = await res.json();
      setIsSubmitting(false);
      setName('');
      setPhone('');
      onSubmitSuccess(data.rsvp);
    } catch (err: any) {
      console.error('Failed to submit choice:', err);
      // Fallback local creation
      const fallbackRsvp: RSVP = {
        id: 'rsvp-local-' + Date.now(),
        name: name.trim(),
        phone: phone.trim(),
        foodChoice,
        submittedAt: new Date().toISOString(),
      };
      setIsSubmitting(false);
      setName('');
      setPhone('');
      onSubmitSuccess(fallbackRsvp);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl overflow-hidden max-w-xl mx-auto my-6">
      {/* Form Title Banner */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-amber-50 p-6 text-center">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-100">
          Add Your Choice of Biryani
        </h2>
        <p className="text-xs text-amber-200/80 mt-1">
          Farewell Party · 30.10.2026 at 12 Noon @ CHQ, Faridabad
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5 text-slate-800">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Guest Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Your Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Mobile / Phone Number */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Phone / Contact Number (Optional)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        {/* Simple Food Choice: Veg Biryani or Non-Veg Biryani */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Select Your Choice of Food <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Veg Biryani Button */}
            <div
              onClick={() => setFoodChoice('veg')}
              className={`cursor-pointer rounded-xl p-4 border-2 transition-all text-center relative ${
                foodChoice === 'veg'
                  ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-emerald-300'
              }`}
            >
              {foodChoice === 'veg' && (
                <div className="absolute top-2 right-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                </div>
              )}

              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                <Leaf className="w-5 h-5" />
              </div>

              <div className="text-emerald-900 font-bold text-sm">
                Veg Biryani
              </div>
              <div className="text-[11px] text-emerald-700/80 font-medium mt-0.5">
                100% Pure Vegetarian
              </div>
            </div>

            {/* Non-Veg Biryani Button */}
            <div
              onClick={() => setFoodChoice('non-veg')}
              className={`cursor-pointer rounded-xl p-4 border-2 transition-all text-center relative ${
                foodChoice === 'non-veg'
                  ? 'bg-amber-50 border-amber-600 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-white border-slate-200 hover:border-amber-300'
              }`}
            >
              {foodChoice === 'non-veg' && (
                <div className="absolute top-2 right-2 text-amber-600">
                  <CheckCircle2 className="w-5 h-5 fill-amber-100" />
                </div>
              )}

              <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                <Flame className="w-5 h-5 text-amber-600" />
              </div>

              <div className="text-amber-900 font-bold text-sm">
                Non-Veg Biryani
              </div>
              <div className="text-[11px] text-amber-800/80 font-medium mt-0.5">
                Non-Vegetarian Choice
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Saving Your Choice...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Food Choice</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
