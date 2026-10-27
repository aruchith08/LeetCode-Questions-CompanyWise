import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sun, Moon, Menu, X, ChevronDown
} from 'lucide-react';
import type { LeetCodeAccount } from '../../types';
import type { SyncOutcome, SyncStatusDetails } from '../../services/leetcodeService';
import LeetCodeModal from '../leetcode/LeetCodeModal';
import CompanyWiseLogo from '../ui/CompanyWiseLogo';
import EcosystemDropdown from './EcosystemDropdown';
import { ECOSYSTEM_PLATFORMS } from '../../config/ecosystem';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  lcAccount: LeetCodeAccount | null;
  isSyncing: boolean;
  syncStatus?: SyncOutcome;
  syncDetails?: SyncStatusDetails | null;
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
  { to: '/patterns', label: 'Patterns' },
  { to: '/progress', label: 'My Progress' },
  { to: '/about', label: 'About' },
];

export default function Header({
  isDark,
  onToggleTheme,
  lcAccount,
  isSyncing,
  syncStatus,
  syncDetails,
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
            {/* Brand Logo with Ecosystem Switcher Dropdown */}
            <EcosystemDropdown />

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
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-[#A8A69C] dark:hover:text-[#FAF9F5] hover:bg-slate-100 dark:hover:bg-[#30302E] transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Backdrop & Drawer Menu */}
        {mobileOpen && (
          <>
            {/* Backdrop Overlay */}
            <div
              className="md:hidden fixed inset-0 top-14 bg-black/40 backdrop-blur-xs z-30 animate-fade-in"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Dropdown Menu */}
            <div className="md:hidden relative z-40 border-t border-slate-200 dark:border-[#43433F] bg-[#F7F8FB] dark:bg-[#262624] px-4 py-4 space-y-3 animate-fade-in shadow-xl max-h-[calc(100vh-3.5rem)] overflow-y-auto">
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
                      className={`min-h-[44px] flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-slate-200/90 dark:bg-[#1F1E1D] text-[#0F1B3D] dark:text-[#FAF9F5] shadow-2xs font-bold'
                          : 'text-slate-600 dark:text-[#A8A69C] hover:bg-slate-100 dark:hover:bg-[#30302E]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F1B3D] dark:bg-[#D97757]" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile LeetCode Sync Banner */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-[#43433F]/80">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between min-h-[44px] p-3 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] text-xs font-semibold text-slate-800 dark:text-[#FAF9F5] hover:bg-slate-50 dark:hover:bg-[#1F1E1D] transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${lcAccount ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    <span>{lcAccount ? `Connected: ${lcAccount.username}` : 'Connect LeetCode Account'}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 -rotate-90" />
                </button>
              </div>

              {/* Mobile Companion Platforms */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-[#43433F]/80 space-y-2">
                <div className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Companion Platforms
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ECOSYSTEM_PLATFORMS.filter(p => !p.isCurrent).map(platform => (
                    <a
                      key={platform.id}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200/90 dark:border-[#43433F] text-xs font-semibold text-slate-800 dark:text-[#FAF9F5] hover:border-[#D97757] transition-all min-h-[44px]"
                    >
                      <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-50 dark:bg-[#262624] p-1 flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-[#43433F]/50">
                        <img
                          src={platform.logo}
                          alt={platform.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="truncate">{platform.name} ↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* LeetCode Sync Modal */}
      <LeetCodeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        account={lcAccount}
        isSyncing={isSyncing}
        syncStatus={syncStatus}
        syncDetails={syncDetails}
        syncError={syncError}
        syncNotice={syncNotice}
        onConnect={onConnectLC}
        onSync={onSyncLC}
        onDisconnect={onDisconnectLC}
      />
    </>
  );
}
