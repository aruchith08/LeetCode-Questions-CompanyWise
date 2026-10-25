import React, { useState } from 'react';
import {
  X, RotateCw, ShieldCheck, User, Award, Flame, LogOut
} from 'lucide-react';
import type { LeetCodeAccount } from '../../types';
import { useAllQuestions } from '../../hooks/useAllQuestions';

interface LeetCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: LeetCodeAccount | null;
  isSyncing: boolean;
  syncError: string | null;
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
  onConnect,
  onSync,
  onDisconnect,
}: LeetCodeModalProps) {
  const [usernameInput, setUsernameInput] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { data: allQuestions } = useAllQuestions();

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    setLocalError(null);
    try {
      await onConnect(usernameInput.trim(), allQuestions || undefined);
    } catch (err: any) {
      setLocalError(err.message || 'Could not connect to LeetCode');
    }
  };

  const handleSyncNow = async () => {
    setLocalError(null);
    try {
      await onSync(allQuestions || undefined);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to sync with LeetCode');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden text-neutral-900 dark:text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Flame className="w-4 h-4 text-amber-500" strokeWidth={1.75} />
            <div>
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">LeetCode Sync</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Sync solved problems in real time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {account ? (
            /* Connected State */
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-md bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                {account.avatar ? (
                  <img
                    src={account.avatar}
                    alt={account.username}
                    className="w-10 h-10 rounded-md border border-neutral-200 dark:border-neutral-700 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-md bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-sm font-mono font-medium text-neutral-700 dark:text-neutral-300">
                    {account.username.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">{account.username}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> synced
                    </span>
                  </div>
                  {account.ranking && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 flex items-center gap-1 font-mono">
                      <Award className="w-3.5 h-3.5 text-neutral-400" /> Rank #{account.ranking.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
                  <p className="text-[11px] text-neutral-500 uppercase font-medium">Total</p>
                  <p className="text-sm font-mono font-semibold text-neutral-900 dark:text-white mt-0.5">{account.totalSolved}</p>
                </div>
                <div className="p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Easy</p>
                  <p className="text-sm font-mono font-semibold text-neutral-900 dark:text-white mt-0.5">{account.easySolved}</p>
                </div>
                <div className="p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Medium</p>
                  <p className="text-sm font-mono font-semibold text-neutral-900 dark:text-white mt-0.5">{account.mediumSolved}</p>
                </div>
                <div className="p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Hard</p>
                  <p className="text-sm font-mono font-semibold text-neutral-900 dark:text-white mt-0.5">{account.hardSolved}</p>
                </div>
              </div>

              {/* Real-time sync guarantee */}
              <div className="p-3 rounded-md bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>
                  <strong className="text-neutral-900 dark:text-neutral-200">Global Sync Active:</strong> Problems solved on LeetCode are automatically marked complete across all companies and time periods in CodeWise.
                </span>
              </div>

              {/* Sync Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleSyncNow}
                  disabled={isSyncing}
                  className="flex-1 py-2 px-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing Problems...' : 'Sync Solved Problems'}
                </button>
                <button
                  onClick={onDisconnect}
                  className="p-2 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Disconnect account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-neutral-500 text-center font-mono">
                Last synced: {new Date(account.lastSyncedAt).toLocaleTimeString()} · Stored locally
              </p>
            </div>
          ) : (
            /* Connect Form */
            <form onSubmit={handleConnect} className="space-y-4">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Connect your LeetCode username to automatically sync your accepted submissions and mark company questions as completed in real time.
              </p>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 dark:text-neutral-400 mb-1.5">
                  LeetCode Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    placeholder="e.g. aruchith08"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-md text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500 text-xs font-mono"
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick suggestion */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <span>Quick try:</span>
                <button
                  type="button"
                  onClick={() => setUsernameInput('aruchith08')}
                  className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 font-mono text-[11px]"
                >
                  aruchith08
                </button>
              </div>

              {(localError || syncError) && (
                <div className="p-2.5 rounded-md bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-400">
                  {localError || syncError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSyncing || !usernameInput.trim()}
                className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
              >
                {isSyncing ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" /> Fetching LeetCode Profile...
                  </>
                ) : (
                  <>
                    <Flame className="w-3.5 h-3.5 text-amber-300" /> Connect & Sync Problems
                  </>
                )}
              </button>

              <div className="p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 space-y-1">
                <p className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" strokeWidth={1.5} /> 100% Private & Client-Side
                </p>
                <p>
                  No password required. Only your public submission history is synced to your browser's local storage.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
