import React, { useState } from 'react';
import { X, Check, ExternalLink, RotateCw, Unlink, ShieldCheck } from 'lucide-react';
import type { LeetCodeAccount } from '../../types';
import { useAllQuestions } from '../../hooks/useAllQuestions';

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
  const { data: allQuestions } = useAllQuestions();
  const [usernameInput, setUsernameInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    setSubmitting(true);
    try {
      await onConnect(usernameInput.trim(), allQuestions || undefined);
      setUsernameInput('');
    } catch {
      // error handled in hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] rounded-2xl shadow-2xl overflow-hidden p-4 sm:p-6 space-y-4 sm:space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lc-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#43433F]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#D97757] text-[#1F1E1D] flex items-center justify-center font-bold text-xs shadow-2xs">
              LC
            </div>
            <div>
              <h2 id="lc-modal-title" className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5]">
                LeetCode Account Sync
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-[#A8A69C]">
                Sync your solved questions directly from your public LeetCode profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#1F1E1D] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notices */}
        {syncNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-[#1F1E1D] border border-emerald-200/80 dark:border-[#8FBF78]/40 text-xs text-emerald-800 dark:text-[#8FBF78] flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-[#8FBF78] shrink-0" />
            <span>{syncNotice}</span>
          </div>
        )}

        {syncError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-[#1F1E1D] border border-rose-200/80 dark:border-[#EE8F78]/40 text-xs text-rose-800 dark:text-[#EE8F78]">
            {syncError}
          </div>
        )}

        {/* State 1: Connected */}
        {account ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200/90 dark:border-[#43433F] bg-slate-50 dark:bg-[#1F1E1D] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#8FBF78]" />
                  <span className="font-bold text-sm text-slate-900 dark:text-[#FAF9F5]">
                    {account.username}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#A8A69C] mt-0.5">
                  Last synced: {account.lastSyncedAt ? new Date(account.lastSyncedAt).toLocaleString() : 'Just now'}
                </p>
              </div>
              <a
                href={`https://leetcode.com/${account.username}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#0F1B3D] dark:text-[#D97757] hover:underline flex items-center gap-1 font-semibold"
              >
                Profile <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => onSync(allQuestions || undefined)}
                disabled={isSyncing}
                className="flex-1 h-9 rounded-xl bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Submissions Now'}</span>
              </button>

              <button
                type="button"
                onClick={onDisconnect}
                className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#43433F] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 dark:hover:bg-[#1F1E1D] dark:hover:border-[#EE8F78]/50 text-xs font-semibold text-slate-600 dark:text-[#A8A69C] transition-colors flex items-center gap-1.5 cursor-pointer"
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
              <label htmlFor="lc-username" className="text-xs font-semibold text-slate-700 dark:text-[#FAF9F5]">
                LeetCode Public Username
              </label>
              <input
                id="lc-username"
                type="text"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                placeholder="e.g. tour_de_code"
                className="w-full h-10 px-3.5 bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200 dark:border-[#43433F] rounded-xl text-xs text-slate-900 dark:text-[#FAF9F5] placeholder-slate-400 dark:placeholder-[#A8A69C] focus:outline-none focus:border-[#0F1B3D] dark:focus:border-[#D97757]"
                required
              />
              <span className="text-[11px] text-slate-500 dark:text-[#A8A69C] block">
                No password required. Connects to your public submission history to check off matching problems.
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting || !usernameInput.trim()}
              className="w-full h-10 rounded-xl bg-[#0F1B3D] hover:bg-[#1A2D5E] dark:bg-[#D97757] dark:hover:bg-[#c66c4e] text-white dark:text-[#1F1E1D] text-xs font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>{submitting ? 'Connecting...' : 'Connect Account'}</span>
            </button>
          </form>
        )}

        {/* Security footnote */}
        <div className="pt-2 border-t border-slate-100 dark:border-[#43433F] text-[11px] text-slate-400 dark:text-[#A8A69C] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500 dark:text-[#A8A69C]" />
          <span>All syncing runs locally in your browser. No credentials or tokens stored.</span>
        </div>
      </div>
    </div>
  );
}
