import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ExternalLink,
  RotateCw,
  Unlink,
  ShieldCheck,
  User,
  Link2,
  ArrowRight,
} from 'lucide-react';
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

function LeetCodeLogo({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#B3B1B0"
        d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"
      />
      <path
        fill="#FFA116"
        d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"
      />
      <path
        fill="#FFFFFF"
        d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"
      />
    </svg>
  );
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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-[28px] overflow-hidden bg-[#0E1015] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col md:flex-row my-auto transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lc-modal-title"
        onClick={e => e.stopPropagation()}
      >
        {/* Circular Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.18] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        {/* Left Column: 3D Developer Illustration with Transparent Background and Ambient Amber Glow */}
        <div className="w-full md:w-[48%] min-h-[250px] sm:min-h-[290px] md:min-h-[440px] relative flex items-center justify-center p-6 sm:p-8 overflow-hidden shrink-0">
          {/* Ambient amber radial glow centered behind character */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(245,158,11,0.22)_0%,rgba(217,119,87,0.08)_50%,transparent_75%)] pointer-events-none" />
          {/* Subtle ground reflection glow */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-amber-500/15 blur-2xl rounded-full pointer-events-none" />
          <img
            src="/developer_transparent.png"
            alt="LeetCode Developer"
            className="relative z-10 w-full max-w-[340px] sm:max-w-[400px] md:max-w-none h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] select-none pointer-events-none"
          />
        </div>

        {/* Right Column: Connection Form / Account Status */}
        <div className="w-full md:w-[52%] p-6 sm:p-8 md:p-10 flex flex-col justify-center relative z-10">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <LeetCodeLogo className="w-10 h-10 sm:w-11 sm:h-11 shrink-0" />
              <h2
                id="lc-modal-title"
                className="text-2xl sm:text-[27px] font-bold tracking-tight text-white font-['Outfit',sans-serif]"
              >
                {account ? 'LeetCode Connected' : 'Connect LeetCode'}
              </h2>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed">
              {account
                ? 'Your solved problems are synced and tracked against company questions.'
                : 'Sync your solved problems from your public LeetCode profile.'}
            </p>
          </div>

          {/* Notices */}
          {syncNotice && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncNotice}</span>
            </div>
          )}

          {syncError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
              {syncError}
            </div>
          )}

          {/* State 1: Connected */}
          {account ? (
            <div className="mt-5 space-y-4">
              {/* Profile summary card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#14161F] border border-white/10 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {account.avatar ? (
                      <img
                        src={account.avatar}
                        alt={account.username}
                        className="w-11 h-11 rounded-full object-cover border border-white/10"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-[#0F1015] font-bold text-sm flex items-center justify-center shadow-md">
                        {account.username.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-white">{account.username}</span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Connected
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Last synced: {account.lastSyncedAt ? new Date(account.lastSyncedAt).toLocaleString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`https://leetcode.com/${account.username}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 font-semibold transition-colors"
                  >
                    Profile <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Difficulty Breakdown badges */}
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/[0.06] text-center">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</div>
                    <div className="text-sm font-bold text-white mt-0.5">{account.totalSolved ?? 0}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Easy</div>
                    <div className="text-sm font-bold text-emerald-300 mt-0.5">{account.easySolved ?? 0}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Medium</div>
                    <div className="text-sm font-bold text-amber-300 mt-0.5">{account.mediumSolved ?? 0}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Hard</div>
                    <div className="text-sm font-bold text-rose-300 mt-0.5">{account.hardSolved ?? 0}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => onSync(allQuestions || undefined)}
                  disabled={isSyncing}
                  className="w-full sm:flex-1 h-12 rounded-xl bg-gradient-to-r from-[#FFA116] via-[#FF8B1F] to-[#EA580C] hover:brightness-110 active:scale-[0.99] text-[#0A0B0E] text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-amber-500/25"
                >
                  <RotateCw className={`w-4 h-4 stroke-[2.5] ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Submissions Now'}</span>
                </button>

                <button
                  type="button"
                  onClick={onDisconnect}
                  className="w-full sm:w-auto h-12 px-5 rounded-xl border border-white/10 hover:border-rose-500/40 hover:bg-rose-500/10 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlink className="w-4 h-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          ) : (
            /* State 2: Not connected */
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="lc-username"
                  className="block text-xs font-semibold text-slate-200 tracking-wide"
                >
                  LeetCode Public Username
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    id="lc-username"
                    type="text"
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    placeholder="e.g. tour_de_code"
                    autoFocus
                    className="w-full h-12 pl-10 pr-4 bg-[#14161F] border border-white/10 hover:border-white/20 focus:border-[#FFA116] focus:ring-2 focus:ring-[#FFA116]/20 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                    required
                  />
                </div>
                <span className="text-[11px] sm:text-xs text-slate-400 block leading-relaxed pt-0.5">
                  No password required. We only read your public profile and solved submissions.
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FFA116] via-[#FF8B1F] to-[#EA580C] hover:brightness-110 active:scale-[0.99] text-[#0A0B0E] font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin stroke-[2.5]" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Connect Account</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security footnote */}
          <div className="mt-5 pt-4 border-t border-white/[0.08] text-[11px] sm:text-xs text-slate-400 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Runs locally in your browser. No credentials stored.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
