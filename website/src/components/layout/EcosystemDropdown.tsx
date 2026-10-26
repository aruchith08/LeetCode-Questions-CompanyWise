import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ExternalLink, Globe, Sparkles, Check } from 'lucide-react';
import CompanyWiseLogo from '../ui/CompanyWiseLogo';
import { ECOSYSTEM_PLATFORMS, type EcosystemPlatform } from '../../config/ecosystem';

export default function EcosystemDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click or touch
  useEffect(() => {
    function handleOutsideInteraction(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideInteraction);
      document.addEventListener('touchstart', handleOutsideInteraction, { passive: true });
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleCurrentPlatformClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* Interactive Logo Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="group flex items-center gap-1.5 px-2 py-1.5 -ml-2 rounded-xl transition-all cursor-pointer select-none text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97757] hover:bg-slate-200/50 dark:hover:bg-[#30302E]/60 active:scale-[0.98]"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Toggle ecosystem websites dropdown"
      >
        <CompanyWiseLogo
          variant="full"
          size="md"
          iconClassName="group-hover:scale-105 transition-transform"
        />
        <div className="flex items-center justify-center w-5 h-5 rounded-full text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ease-out ${
              isOpen ? 'rotate-180 text-[#D97757] dark:text-[#D97757]' : ''
            }`}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25 dark:bg-black/50 backdrop-blur-[2px] sm:hidden animate-in fade-in duration-150"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-2.5 z-50 w-[calc(100vw-2rem)] max-w-sm sm:w-[390px] bg-white/95 dark:bg-[#1E1E1C]/95 backdrop-blur-xl border border-slate-200/90 dark:border-[#43433F] rounded-2xl shadow-2xl p-2.5 transition-all animate-in fade-in zoom-in-95 duration-150"
          role="menu"
          aria-orientation="vertical"
          aria-label="Ecosystem platforms"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-[#30302E] mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-[#A09E96]">
                Ecosystem Platforms
              </span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Click to Switch
            </span>
          </div>

          {/* Platform Items */}
          <div className="space-y-1">
            {ECOSYSTEM_PLATFORMS.map((platform: EcosystemPlatform) => {
              if (platform.isCurrent) {
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={handleCurrentPlatformClick}
                    className="w-full group/item flex items-start gap-3 p-2.5 rounded-xl text-left transition-all bg-slate-50/80 dark:bg-[#262624]/70 border border-slate-200/60 dark:border-[#383835] hover:border-slate-300 dark:hover:border-[#4B4B47] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97757]"
                    role="menuitem"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] p-1.5 flex items-center justify-center shrink-0 shadow-xs group-hover/item:scale-105 transition-transform">
                      <CompanyWiseLogo variant="mark" size="sm" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5] truncate">
                          {platform.name}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Current
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-[#A09E96] truncate mt-0.5">
                        {platform.tagline}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                        {platform.description}
                      </p>
                    </div>
                  </button>
                );
              }

              return (
                <a
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-full group/item flex items-start gap-3 p-2.5 rounded-xl text-left transition-all hover:bg-slate-100/90 dark:hover:bg-[#2A2A28] border border-transparent hover:border-slate-200 dark:hover:border-[#383835] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97757] active:scale-[0.99]"
                  role="menuitem"
                >
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#262624] border border-slate-200/80 dark:border-[#43433F] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs group-hover/item:scale-105 transition-transform">
                    <img
                      src={platform.logo}
                      alt={`${platform.name} logo`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-[#FAF9F5] group-hover/item:text-[#D97757] transition-colors truncate">
                        {platform.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover/item:text-[#D97757] transition-colors shrink-0">
                        Launch
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#A09E96] truncate mt-0.5">
                      {platform.tagline}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                      {platform.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Footer Banner */}
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#30302E] px-2.5 py-1 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>Built by Alokam Ruchith • ARH</span>
            <a
              href="https://github.com/aruchith08"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="hover:text-slate-700 dark:hover:text-slate-300 font-medium transition-colors"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
