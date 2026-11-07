import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error | null; resetError: () => void }) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public resetError = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
  };

  public toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({
            error: this.state.error,
            resetError: this.resetError,
          });
        }
        return this.props.fallback;
      }

      return (
        <div
          data-testid="error-boundary-fallback"
          className="min-h-[60vh] flex items-center justify-center px-4 py-12"
        >
          <div className="max-w-lg w-full bg-white dark:bg-[#30302E] border border-slate-200 dark:border-[#43433F] rounded-2xl shadow-xl p-6 sm:p-8 text-center space-y-5 animate-fade-in">
            {/* Warning Icon Badge */}
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 dark:bg-[#D97757]/15 border border-amber-500/25 dark:border-[#D97757]/30 flex items-center justify-center text-amber-600 dark:text-[#D97757]">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>

            {/* Error Message Heading */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#FAF9F5]">
                Something went wrong
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A8A69C] leading-relaxed">
                An unexpected error occurred while rendering this view. Your saved progress, bookmarks, and solved questions are completely safe.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.resetError}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F1B3D] dark:bg-[#D97757] text-white dark:text-[#1F1E1D] text-xs font-bold hover:bg-[#1A2D5E] dark:hover:bg-[#c66c4e] transition-colors shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Try Again</span>
              </button>

              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-[#43433F] bg-slate-50 dark:bg-[#1F1E1D] hover:bg-slate-100 dark:hover:bg-[#262624] text-slate-700 dark:text-[#FAF9F5] text-xs font-semibold transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </a>
            </div>

            {/* Expandable Technical Details */}
            {this.state.error && (
              <div className="pt-2 text-left border-t border-slate-100 dark:border-[#43433F]/70">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="w-full flex items-center justify-between text-[11px] font-mono text-slate-400 hover:text-slate-600 dark:hover:text-[#FAF9F5] py-1 cursor-pointer transition-colors"
                >
                  <span>Technical details</span>
                  {this.state.showDetails ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
                {this.state.showDetails && (
                  <pre className="mt-2 p-3 rounded-lg bg-slate-100 dark:bg-[#1F1E1D] text-[11px] font-mono text-rose-600 dark:text-rose-400 overflow-x-auto whitespace-pre-wrap break-all max-h-36 border border-slate-200 dark:border-[#43433F]">
                    {this.state.error.message || String(this.state.error)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
