import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { FileSpreadsheet, CheckCircle2, LogOut, RefreshCw, Link as LinkIcon, Code2 } from 'lucide-react';

interface GoogleSheetSyncBarProps {
  user: User | null;
  accessToken: string | null;
  spreadsheetId: string;
  setSpreadsheetId: (id: string) => void;
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  onSyncAllToSheet: () => void;
  isSyncing: boolean;
  syncSuccessMsg: string | null;
}

export const GoogleSheetSyncBar: React.FC<GoogleSheetSyncBarProps> = ({
  user,
  accessToken,
  spreadsheetId,
  setSpreadsheetId,
  webhookUrl,
  setWebhookUrl,
  onGoogleSignIn,
  onGoogleSignOut,
  onSyncAllToSheet,
  isSyncing,
  syncSuccessMsg,
}) => {
  const [showSheetInput, setShowSheetInput] = useState(false);
  const [showScriptCode, setShowScriptCode] = useState(false);

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-950 text-white rounded-xl p-3 shadow-lg border border-emerald-600/40 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title & Status */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500 text-emerald-950 font-bold shrink-0">
            <FileSpreadsheet className="w-4 h-4 text-emerald-950" />
          </div>
          <div>
            <div className="font-extrabold text-emerald-100 flex items-center gap-1.5">
              <span>Google Sheets Live Auto-Sync</span>
              {webhookUrl || accessToken ? (
                <span className="bg-emerald-500 text-emerald-950 text-[10px] px-2 py-0.2 rounded font-black uppercase">
                  Active
                </span>
              ) : (
                <span className="bg-amber-500/30 text-amber-300 text-[10px] px-2 py-0.2 rounded border border-amber-500/40 font-bold">
                  Link Webhook / Sign In
                </span>
              )}
            </div>
            <div className="text-[11px] text-emerald-200/80">
              Columns: <strong>Name</strong> | <strong>Physical Present</strong> | <strong>Veg/Non VEg</strong> | <strong>Mobile No.</strong>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSheetInput(!showSheetInput)}
            className="px-2.5 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600 rounded-lg text-emerald-100 font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5 text-emerald-300" />
            <span>Link Webhook / Sheet</span>
          </button>

          <button
            onClick={() => setShowScriptCode(!showScriptCode)}
            className="px-2.5 py-1.5 bg-amber-900/80 hover:bg-amber-800 border border-amber-600 rounded-lg text-amber-100 font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Apps Script Code</span>
          </button>

          {accessToken ? (
            <>
              <button
                onClick={onSyncAllToSheet}
                disabled={isSyncing}
                className="px-3 py-1.5 bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-emerald-950 font-black rounded-lg shadow transition-all active:translate-y-0.5 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync All Choices'}</span>
              </button>

              <button
                onClick={onGoogleSignOut}
                title="Sign out of Google"
                className="p-1.5 bg-emerald-950 hover:bg-rose-950 text-emerald-300 hover:text-rose-300 border border-emerald-700/60 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={onGoogleSignIn}
              className="gsi-material-button bg-white text-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300 font-bold text-xs flex items-center gap-2 shadow transition-all active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>Host OAuth Sign-In</span>
            </button>
          )}
        </div>
      </div>

      {/* Sheet ID & Webhook Input */}
      {showSheetInput && (
        <div className="mt-2.5 pt-2 border-t border-emerald-700/60 space-y-2">
          <div className="flex items-center gap-2">
            <label className="font-bold text-emerald-200 shrink-0 w-32">Google Sheet Webhook URL:</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Paste Google Apps Script Webhook URL (https://script.google.com/macros/s/.../exec)"
              className="flex-1 px-2.5 py-1 bg-emerald-950 border border-emerald-600 rounded text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="font-bold text-emerald-200 shrink-0 w-32">Google Sheet ID:</label>
            <input
              type="text"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              placeholder="Paste Google Sheet ID..."
              className="flex-1 px-2.5 py-1 bg-emerald-950 border border-emerald-600 rounded text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>
      )}

      {/* Apps Script Code Helper Modal */}
      {showScriptCode && (
        <div className="mt-2.5 p-3 rounded bg-slate-900 border border-amber-500/60 text-[11px] space-y-1.5 font-mono text-amber-200">
          <div className="font-bold text-amber-400 flex items-center justify-between">
            <span>📋 Google Apps Script Setup Code (Copy into Extensions → Apps Script):</span>
            <button
              onClick={() => setShowScriptCode(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕ Close
            </button>
          </div>
          <pre className="bg-black/80 p-2 rounded overflow-x-auto text-[10px] text-emerald-300">
{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.name,
    data.attending,
    data.foodChoice,
    data.phone
  ]);
  return ContentService.createTextOutput(JSON.stringify({"result":"success"})).setMimeType(ContentService.MimeType.JSON);
}`}
          </pre>
          <div className="text-[10px] text-amber-300/80">
            1. Open Google Sheet → Extensions → Apps Script → Paste code above → Click Deploy as Web App.<br />
            2. Set "Who has access" to "Anyone" → Copy Webhook URL and paste into Webhook URL field above!
          </div>
        </div>
      )}

      {/* Sync Success Message Alert */}
      {syncSuccessMsg && (
        <div className="mt-2 p-2 rounded bg-emerald-900/90 border border-emerald-500 text-emerald-200 font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}
    </div>
  );
};
