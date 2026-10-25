import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string;
  menuClassName?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  align?: 'left' | 'right';
  size?: 'sm' | 'md';
}

export default function CustomDropdown({
  value,
  onChange,
  options,
  icon,
  placeholder = 'Select...',
  className = '',
  menuClassName = '',
  searchable = false,
  searchPlaceholder = 'Filter options...',
  align = 'left',
  size = 'sm',
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus search input on open if searchable
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch('');
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find(o => o.value === value);

  const filteredOptions = searchable && search.trim()
    ? options.filter(o =>
        o.label.toLowerCase().includes(search.trim().toLowerCase()) ||
        o.value.toLowerCase().includes(search.trim().toLowerCase())
      )
    : options;

  const handleSelect = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(val);
    setIsOpen(false);
  };

  const heightClass = size === 'md' ? 'h-10 text-xs px-3.5' : 'h-9 text-xs px-3';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full flex items-center justify-between gap-2 ${heightClass} bg-white dark:bg-[#30302E] border ${
          isOpen
            ? 'border-[#0F1B3D] dark:border-[#D97757] ring-2 ring-[#0F1B3D]/10 dark:ring-[#D97757]/15'
            : 'border-slate-200/90 dark:border-[#43433F] hover:border-slate-300 dark:hover:border-slate-500'
        } rounded-xl font-semibold text-slate-800 dark:text-[#FAF9F5] shadow-2xs transition-all cursor-pointer select-none`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          {icon && <span className="text-slate-400 dark:text-[#A8A69C] shrink-0">{icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge !== undefined && (
            <span className="ml-1 text-[11px] font-mono font-normal opacity-70">
              ({selectedOption.badge})
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0F1B3D] dark:text-[#D97757]' : 'text-slate-400'
          }`}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } top-full mt-1.5 z-50 min-w-[200px] max-w-[280px] sm:max-w-xs max-h-72 overflow-y-auto rounded-xl border border-slate-200/90 dark:border-[#43433F] bg-white dark:bg-[#30302E] p-1.5 shadow-xl shadow-slate-900/10 dark:shadow-black/50 text-xs animate-fade-in divide-y divide-slate-100 dark:divide-[#43433F]/60 ${menuClassName}`}
          role="listbox"
        >
          {/* Optional Search Bar inside dropdown */}
          {searchable && (
            <div className="p-1 pb-1.5 sticky top-0 bg-white dark:bg-[#30302E] z-10">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-8 pl-8 pr-2.5 text-xs bg-slate-50 dark:bg-[#1F1E1D] border border-slate-200/80 dark:border-[#43433F] rounded-lg text-slate-900 dark:text-[#FAF9F5] placeholder-slate-400 focus:outline-none focus:border-[#0F1B3D] dark:focus:border-[#D97757]"
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="py-0.5 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-slate-400 dark:text-[#A8A69C] text-center text-xs">
                No matching options
              </div>
            ) : (
              filteredOptions.map(option => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={e => handleSelect(option.value, e)}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-[#1F1E1D] text-[#0F1B3D] dark:text-[#D97757] font-bold'
                        : 'text-slate-700 dark:text-[#FAF9F5] hover:bg-slate-50 dark:hover:bg-[#1F1E1D]/60 font-medium'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="flex items-center gap-2 min-w-0 truncate">
                      {option.icon && (
                        <span className="shrink-0 text-slate-400">{option.icon}</span>
                      )}
                      <span className="truncate">{option.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {option.badge !== undefined && (
                        <span className="font-mono text-[10px] text-slate-400 dark:text-[#A8A69C]">
                          {option.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#0F1B3D] dark:text-[#D97757] stroke-[2.5]" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
