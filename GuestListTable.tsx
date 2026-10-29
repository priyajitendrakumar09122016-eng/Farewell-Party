import React, { useState } from 'react';
import { RSVP } from '../types';
import { Search, Trash2, Leaf, Flame, Phone, Download, RefreshCw } from 'lucide-react';

interface GuestListTableProps {
  rsvps: RSVP[];
  onDeleteRsvp: (id: string) => void;
  onRefresh: () => void;
}

export const GuestListTable: React.FC<GuestListTableProps> = ({ rsvps, onDeleteRsvp, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChoice, setFilterChoice] = useState<'all' | 'veg' | 'non-veg'>('all');

  const filtered = rsvps.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.phone && r.phone.includes(searchQuery));
    const matchesChoice =
      filterChoice === 'all' || r.foodChoice === filterChoice;
    return matchesSearch && matchesChoice;
  });

  const handleExportCSV = () => {
    const headers = ['Name', 'Phone', 'Food Choice', 'Date Submitted'];
    const rows = rsvps.map((r) => [
      `"${r.name}"`,
      `"${r.phone || ''}"`,
      `"${r.foodChoice.toUpperCase()}"`,
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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 max-w-3xl mx-auto my-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Member Choices List ({rsvps.length} Responses Saved)
          </h3>
          <p className="text-xs text-slate-500">
            Restored live on web server for host and members
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRefresh}
            title="Refresh list"
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download List</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search member name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0 font-medium">
          <button
            onClick={() => setFilterChoice('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterChoice === 'all'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({rsvps.length})
          </button>
          <button
            onClick={() => setFilterChoice('veg')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterChoice === 'veg'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Veg
          </button>
          <button
            onClick={() => setFilterChoice('non-veg')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              filterChoice === 'non-veg'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Non-Veg
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
              <th className="p-3">#</th>
              <th className="p-3">Member Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Choice of Food</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500">
                  No responses found.
                </td>
              </tr>
            ) : (
              filtered.map((r, idx) => (
                <tr key={r.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="p-3 font-bold text-slate-900">{r.name}</td>
                  <td className="p-3 text-slate-500 font-mono">
                    {r.phone || <span className="text-slate-300">-</span>}
                  </td>
                  <td className="p-3">
                    {r.foodChoice === 'veg' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Veg Biryani</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold">
                        <Flame className="w-3.5 h-3.5 text-amber-600" />
                        <span>Non-Veg Biryani</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onDeleteRsvp(r.id)}
                      title="Remove choice"
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
