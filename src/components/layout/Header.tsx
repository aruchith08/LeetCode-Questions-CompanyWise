import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sun, Moon, Menu, X, Search, RotateCw, Code2, Check, ChevronDown
} from 'lucide-react';
import type { LeetCodeAccount } from '../../types';
import LeetCodeModal from '../leetcode/LeetCodeModal';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  lcAccount: LeetCodeAccount | null;
  isSyncing: boolean;
  syncError: string | null;
  syncNotice: string | null;
  onConnectLC: (username: string, questions?: any[]) => Promise<any>;
  onSyncLC: (questions?: any[]) => Promise<any>;
  onDisconnectLC: () => void;
}

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/companies', label: 'Companies' },
  { to: '/problems', label: 'Problems' },
  { to: '/progress', label: 'My Progress' },
];

export default function Header({
  isDark,
  onToggleTheme,
  lcAccount,
  isSyncing,
  syncError,
  syncNotice,
  onConnectLC,
  onSyncLC,
  onDisconnectLC,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerSearch.trim()) return;
    navigate(`/problems?q=${encodeURIComponent(headerSearch.trim())}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA]/90 dark:bg-[#0A0A0B]/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 21 12 15 6" />
                  <polyline points="9 6 3 12 9 18" />
                </svg>
              </span>
              <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white">
                Code<span className="text-blue-600 dark:text-blue-400">Wise</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => {
                const isActive = item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-neutral-900 dark:text-white'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-2.5 left-3 right-3 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Global Search in Header */}
            <div className="hidden md:flex flex-1 max-w-sm mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={headerSearch}
                  onChange={e => setHeaderSearch(e.target.value)}
                  placeholder="Search 1,446 problems, companies..."
                  className="w-full h-8 pl-8 pr-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-700 transition-colors"
                />
              </form>
            </div>

            {/* Right Side Tools & Account */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Theme Toggle */}
              <button
                onClick={onToggleTheme}
                className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-neutral-300" /> : <Moon className="w-4 h-4 text-neutral-600" />}
              </button>

              {/* LeetCode Sync Button / Profile Pill */}
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 h-8 px-2.5 rounded-md bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors text-xs font-medium text-neutral-700 dark:text-neutral-300"
                title="LeetCode Account Sync"
              >
                {lcAccount ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="truncate max-w-[90px] font-medium">{lcAccount.username}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    {isSyncing && <RotateCw className="w-3 h-3 text-blue-500 animate-spin ml-0.5" />}
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    <span>Connect LeetCode</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                aria-label="Open menu"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Global Sync Notification Bar */}
        {syncNotice && (
          <div className="bg-neutral-900 text-white dark:bg-neutral-800 text-xs py-1.5 px-4 text-center font-medium border-t border-neutral-800 flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{syncNotice}</span>
          </div>
        )}

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA] dark:bg-[#0A0A0B] px-4 py-3 space-y-1">
            {navItems.map(item => {
              const isActive = item.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-md text-xs font-medium ${
                    isActive
                      ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* LeetCode Sync Dialog */}
      <LeetCodeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        account={lcAccount}
        isSyncing={isSyncing}
        syncError={syncError}
        onConnect={onConnectLC}
        onSync={onSyncLC}
        onDisconnect={onDisconnectLC}
      />
    </>
  );
}
