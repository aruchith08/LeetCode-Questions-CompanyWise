import React, { useState } from 'react';
import { X, Check, ExternalLink, RotateCw, Unlink, ShieldCheck } from 'lucide-react';
import type { LeetCodeAccount } from '../../types';

interface LeetCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: LeetCodeAccount | null;
  isSyncing: boolean;
  syncError: string | null;
  syncNotice: string | null;
  onConnect: (username: string, questions?: any[]) => Promise<any>;
  onSync: (questions?: any[]) => Promise<any>;
  onDisconnect: () => void;
}

export default function LeetCodeModal({
  isOpen,
  onClose,
  account,
  isSyncing,
  syncError,
  syncNotice,
  onConnect,
  onSync,
  onDisconnect,
}: LeetCodeModalProps) {
  const [usernameInput, setUsernameInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setSubmitting(true);
    try {
      await onConnect(usernameInput.trim());
      setUsernameInput('');
    } catch {
      // error handled in hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-[#1E2027] border border-slate-200 dark:border-[#282B35] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lc-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#282B35]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              LC
            </div>
            <div>
              <h2 id="lc-modal-title" className="text-sm font-bold text-slate-900 dark:text-white">
                LeetCode Account Sync
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sync your solved questions directly from your public LeetCode profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#252832] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notices */}
        {syncNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncNotice}</span>
          </div>
        )}

        {syncError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/80 text-xs text-rose-800 dark:text-rose-300">
            {syncError}
          </div>
        )}

        {/* State 1: Connected */}
        {account ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200/90 dark:border-[#282B35] bg-slate-50 dark:bg-[#17191E] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {account.username}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Last synced: {account.lastSyncedAt ? new Date(account.lastSyncedAt).toLocaleString() : 'Just now'}
                </p>
              </div>
              <a
                href={`https://leetcode.com/${account.username}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#0F1B3D] dark:text-[#F5A524] hover:underline flex items-center gap-1 font-semibold"
              >
                Profile <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => onSync()}
                disabled={isSyncing}
                className="flex-1 h-9 rounded-xl bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#0F1B3D] text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Submissions Now'}</span>
              </button>

              <button
                type="button"
                onClick={onDisconnect}
                className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#282B35] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 dark:hover:bg-rose-950/30 dark:hover:border-rose-800 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        ) : (
          /* State 2: Not connected */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="lc-username" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                LeetCode Public Username
              </label>
              <input
                id="lc-username"
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                placeholder="e.g. tour_de_code"
                className="w-full h-10 px-3.5 bg-slate-50 dark:bg-[#111215] border border-slate-200 dark:border-[#282B35] rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#0F1B3D] dark:focus:border-[#F5A524]"
                required
              />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                No password required. Connects to your public submission history to check off matching problems.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting || !usernameInput.trim()}
              className="w-full h-10 rounded-xl bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#0F1B3D] text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>{submitting ? 'Connecting...' : 'Connect Account'}</span>
            </button>
          </form>
        )}

        {/* Security footnote */}
        <div className="pt-2 border-t border-slate-100 dark:border-[#282B35] text-[11px] text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>All syncing runs locally in your browser. No credentials or tokens stored.</span>
        </div>
      </div>
    </div>
  );
}
