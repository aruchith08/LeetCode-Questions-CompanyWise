import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useProgress } from '../../hooks/useProgress';

interface LayoutProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Layout({ isDark, onToggleTheme }: LayoutProps) {
  const {
    lcAccount,
    isSyncing,
    syncError,
    syncNotice,
    connectLeetCode,
    syncLeetCode,
    disconnectLeetCode,
  } = useProgress();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FB] dark:bg-[#0B132B] text-neutral-900 dark:text-neutral-100 transition-colors duration-150">
      <Header
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        lcAccount={lcAccount}
        isSyncing={isSyncing}
        syncError={syncError}
        syncNotice={syncNotice}
        onConnectLC={connectLeetCode}
        onSyncLC={syncLeetCode}
        onDisconnectLC={disconnectLeetCode}
      />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
