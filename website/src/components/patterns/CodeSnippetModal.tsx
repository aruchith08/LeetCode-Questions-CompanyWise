import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Code2, Terminal } from 'lucide-react';

export interface CodeLanguageOption {
  id: string;
  label: string;
  code: string;
}

export interface CodeSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  languages?: CodeLanguageOption[];
  activeLanguage?: string;
  onLanguageChange?: (langId: string) => void;
  /** Fallback single code snippet if languages array is not passed */
  code?: string;
  language?: string;
}

export default function CodeSnippetModal({
  isOpen,
  onClose,
  title,
  subtitle,
  timeComplexity,
  spaceComplexity,
  languages,
  activeLanguage,
  onLanguageChange,
  code: singleCode,
  language: singleLanguage = 'python',
}: CodeSnippetModalProps) {
  const [copied, setCopied] = useState(false);
  const [internalLang, setInternalLang] = useState<string>(
    activeLanguage || (languages && languages.length > 0 ? languages[0].id : singleLanguage)
  );

  // Sync internal language if controlled from outside
  useEffect(() => {
    if (activeLanguage) {
      setInternalLang(activeLanguage);
    }
  }, [activeLanguage]);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Determine active code
  let currentCode = singleCode || '';
  let currentLangLabel = singleLanguage;

  if (languages && languages.length > 0) {
    const selected = languages.find(l => l.id === internalLang) || languages[0];
    currentCode = selected.code;
    currentLangLabel = selected.label;
  }

  const lines = currentCode.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLangSelect = (langId: string) => {
    setInternalLang(langId);
    if (onLanguageChange) {
      onLanguageChange(langId);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/75 dark:bg-black/85 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="code-modal-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            {/* macOS style window pill dots */}
            <div className="flex items-center gap-1.5 shrink-0 hidden sm:flex">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/60" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/60" />
            </div>

            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#D97757] shrink-0" />
              <div>
                <h3
                  id="code-modal-title"
                  className="text-sm sm:text-base font-bold text-slate-100 tracking-tight"
                >
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            {/* Complexity Badges if available */}
            {(timeComplexity || spaceComplexity) && (
              <div className="flex items-center gap-1.5 hidden md:flex">
                {timeComplexity && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-[#D97757] border border-slate-700">
                    Time: {timeComplexity}
                  </span>
                )}
                {spaceComplexity && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                    Space: {spaceComplexity}
                  </span>
                )}
              </div>
            )}

            {/* Language Switcher Pill (if multiple languages) */}
            {languages && languages.length > 1 && (
              <div className="inline-flex rounded-lg p-0.5 bg-slate-800 border border-slate-700">
                {languages.map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => handleLangSelect(l.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      internalLang === l.id
                        ? 'bg-[#D97757] text-[#1F1E1D] font-bold shadow-2xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}

            {/* Copy Code Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Copy full code to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors cursor-pointer"
              aria-label="Close code popup"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Code Viewer Body with Line Numbers */}
        <div className="flex-1 overflow-auto bg-[#0F172A] p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed text-slate-100 select-text">
          <div className="flex min-w-full">
            {/* Line numbers column */}
            <div className="select-none pr-4 sm:pr-6 text-right text-slate-500/70 border-r border-slate-800 font-mono text-xs sm:text-sm shrink-0">
              {lines.map((_, idx) => (
                <div key={idx} className="leading-relaxed">
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Code lines column */}
            <pre className="pl-4 sm:pl-6 overflow-x-auto flex-1 font-mono text-xs sm:text-sm leading-relaxed text-slate-100">
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>

        {/* Modal Bottom Footer Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 font-mono shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{currentLangLabel}</span>
            <span className="text-slate-600">•</span>
            <span>{lines.length} lines</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-slate-500">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">Esc</kbd> to close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
