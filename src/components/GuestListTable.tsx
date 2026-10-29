import React, { useState } from 'react';
import { RSVP } from '../types';
import { Download, Trash2, Leaf, Flame, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

interface GuestListTableProps {
  rsvps: RSVP[];
  onDeleteRsvp: (id: string) => void;
  onRefresh: () => void;
}

export const GuestListTable: React.FC<GuestListTableProps> = ({ rsvps, onDeleteRsvp }) => {
  const [filterChoice, setFilterChoice] = useState<'all' | 'attending' | 'veg' | 'non-veg'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = rsvps.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.phone && r.phone.includes(searchQuery));

    if (!matchesSearch) return false;

    if (filterChoice === 'attending') return r.attending;
    if (filterChoice === 'veg') return r.attending && r.foodChoice === 'veg';
    if (filterChoice === 'non-veg') return r.attending && r.foodChoice === 'non-veg';
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Name', 'Phone', 'Attending Physically', 'Food Choice', 'Date Submitted'];
    const rows = rsvps.map((r) => [
      `"${r.name}"`,
      `"${r.phone || ''}"`,
      `"${r.attending ? 'YES' : 'NO'}"`,
      `"${r.attending ? (r.foodChoice === 'veg' ? 'VEG BIRYANI' : 'NON-VEG BIRYANI') : 'NOT ATTENDING'}"`,
      `"${new Date(r.submittedAt).toLocaleString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Farewell_Party_Biryani_Choices.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gradient-to-b from-white via-amber-50/20 to-white border border-amber-200 rounded-2xl p-4 shadow-xl text-xs space-y-3">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-amber-950 text-sm">
            Live Member Responses ({rsvps.length})
          </span>
          {rsvps.length === 0 && (
            <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold">
              Ready for Input (0 Recorded)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-amber-600 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2 py-1 bg-white border border-amber-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 w-36 sm:w-48"
            />
          </div>

          {rsvps.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="py-1.5 px-3 bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 border-t border-amber-200 border-b-2 border-b-amber-900 text-amber-950 font-black text-xs rounded-lg shadow-md transition-all active:translate-y-0.5 active:border-b-0 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-amber-950" />
              <span>Download CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 font-bold text-[11px] bg-amber-100/60 p-1 rounded-xl">
        <button
          onClick={() => setFilterChoice('all')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filterChoice === 'all'
              ? 'bg-amber-600 text-white shadow-sm font-extrabold'
              : 'text-amber-900 hover:bg-amber-200/60'
          }`}
        >
          All ({rsvps.length})
        </button>
        <button
          onClick={() => setFilterChoice('attending')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filterChoice === 'attending'
              ? 'bg-amber-800 text-white shadow-sm font-extrabold'
              : 'text-amber-900 hover:bg-amber-200/60'
          }`}
        >
          Attending ({rsvps.filter((r) => r.attending).length})
        </button>
        <button
          onClick={() => setFilterChoice('veg')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filterChoice === 'veg'
              ? 'bg-emerald-700 text-white shadow-sm font-extrabold'
              : 'text-emerald-900 hover:bg-emerald-100'
          }`}
        >
          Veg ({rsvps.filter((r) => r.attending && r.foodChoice === 'veg').length})
        </button>
        <button
          onClick={() => setFilterChoice('non-veg')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            filterChoice === 'non-veg'
              ? 'bg-amber-700 text-white shadow-sm font-extrabold'
              : 'text-amber-950 hover:bg-amber-200/60'
          }`}
        >
          Non-Veg ({rsvps.filter((r) => r.attending && r.foodChoice === 'non-veg').length})
        </button>
      </div>

      {/* Glossy Table Container */}
      <div className="overflow-y-auto max-h-56 border border-amber-200/80 rounded-xl bg-white shadow-inner">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-gradient-to-r from-amber-100 to-amber-50 font-bold uppercase text-amber-950 border-b border-amber-200">
            <tr>
              <th className="p-2.5">#</th>
              <th className="p-2.5">Name</th>
              <th className="p-2.5">Phone</th>
              <th className="p-2.5">Attending?</th>
              <th className="p-2.5">Food Choice</th>
              <th className="p-2.5 text-right">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-amber-800/60 font-medium italic">
                  {rsvps.length === 0
                    ? 'No member choices recorded yet. Form above is ready for responses!'
                    : 'No choices match the selected filter.'}
                </td>
              </tr>
            ) : (
              filtered.map((r, idx) => (
                <tr key={r.id} className="hover:bg-amber-50/60 transition-colors">
                  <td className="p-2.5 text-amber-600 font-mono font-bold">{idx + 1}</td>
                  <td className="p-2.5 font-bold text-slate-900">{r.name}</td>
                  <td className="p-2.5 text-slate-500 font-mono">
                    {r.phone || <span className="text-slate-300">-</span>}
                  </td>
                  <td className="p-2.5">
                    {r.attending ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-extrabold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>No</span>
                      </span>
                    )}
                  </td>
                  <td className="p-2.5">
                    {r.attending ? (
                      r.foodChoice === 'veg' ? (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-2.5 py-0.5 rounded-lg font-bold shadow-sm">
                          <Leaf className="w-3.5 h-3.5 text-emerald-200" />
                          <span>Veg Biryani</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-2.5 py-0.5 rounded-lg font-bold shadow-sm">
                          <Flame className="w-3.5 h-3.5 text-amber-200" />
                          <span>Non-Veg Biryani</span>
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400 font-normal">Not Attending</span>
                    )}
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => onDeleteRsvp(r.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
