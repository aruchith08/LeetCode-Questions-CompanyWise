import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sun, Moon, Menu, X, ChevronDown
} from 'lucide-react';
import type { LeetCodeAccount } from '../../types';
import LeetCodeModal from '../leetcode/LeetCodeModal';
import CompanyWiseLogo from '../ui/CompanyWiseLogo';

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
  { to: '/about', label: 'About' },
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
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-[#43433F] bg-[#F7F8FB]/90 dark:bg-[#262624]/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97757] rounded-lg"
              aria-label="CompanyWise Home"
            >
              <CompanyWiseLogo
                variant="full"
                size="md"
                iconClassName="group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Desktop Navigation Links (Centered) */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map(item => {
                const isActive = item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#0F1B3D] dark:text-[#FAF9F5] bg-slate-200/80 dark:bg-[#1F1E1D] shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 dark:text-[#A8A69C] dark:hover:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#30302E]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Tools & Account */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#30302E] transition-colors focus:outline-none cursor-pointer"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-[#D97757]" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* LeetCode Sync Pill */}
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 h-8 px-2.5 rounded-lg bg-white dark:bg-[#30302E] hover:bg-slate-50 dark:hover:bg-[#1F1E1D] border border-slate-200 dark:border-[#43433F] transition-colors text-xs font-medium text-slate-700 dark:text-[#FAF9F5] cursor-pointer shadow-2xs"
                title="LeetCode Account Sync"
              >
                {lcAccount ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#8FBF78]" />
                    <span className="truncate max-w-[80px] font-semibold">{lcAccount.username}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-[#A8A69C]" />
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-[#A8A69C]" />
                    <span className="hidden sm:inline">Connect LeetCode</span>
                    <span className="sm:hidden">Sync</span>
                  </>
                )}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#30302E] transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-[#43433F] bg-[#F7F8FB] dark:bg-[#262624] px-4 py-3 space-y-1 animate-fade-in">
            <nav className="flex flex-col space-y-1">
              {navItems.map(item => {
                const isActive = item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-slate-200 dark:bg-[#1F1E1D] text-[#0F1B3D] dark:text-[#FAF9F5]'
                        : 'text-slate-600 dark:text-[#A8A69C] hover:bg-slate-100 dark:hover:bg-[#30302E]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* LeetCode Sync Modal */}
      <LeetCodeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        account={lcAccount}
        isSyncing={isSyncing}
        syncError={syncError}
        syncNotice={syncNotice}
        onConnect={onConnectLC}
        onSync={onSyncLC}
        onDisconnect={onDisconnectLC}
      />
    </>
  );
}
