import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sun, Moon, Menu, X, Search, ChevronDown
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
    setHeaderSearch('');
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA]/90 dark:bg-[#0A0A0B]/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
              aria-label="CompanyWise Home"
            >
              <CompanyWiseLogo
                variant="full"
                size="md"
                iconClassName="group-hover:scale-105 transition-transform"
              />
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
                    className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isActive
                        ? 'text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800/70'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Header Search Command Input */}
            <div className="hidden md:flex flex-1 max-w-sm mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={headerSearch}
                  onChange={e => setHeaderSearch(e.target.value)}
                  placeholder="Quick search problems or companies..."
                  className="w-full h-8 pl-8 pr-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </form>
            </div>

            {/* Right Side Tools & Account */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors focus:outline-none cursor-pointer"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-neutral-300" /> : <Moon className="w-4 h-4 text-neutral-600" />}
              </button>

              {/* LeetCode Sync Pill */}
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 h-8 px-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 transition-colors text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer"
                title="LeetCode Account Sync"
              >
                {lcAccount ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="truncate max-w-[80px] font-semibold">{lcAccount.username}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    <span className="hidden sm:inline">Connect LeetCode</span>
                    <span className="sm:hidden">Sync</span>
                  </>
                )}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-[#FAFAFA] dark:bg-[#0A0A0B] px-4 py-3 space-y-2 animate-fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full pb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                type="text"
                value={headerSearch}
                onChange={e => setHeaderSearch(e.target.value)}
                placeholder="Search problems, companies..."
                className="w-full h-9 pl-9 pr-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500"
              />
            </form>

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
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
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
