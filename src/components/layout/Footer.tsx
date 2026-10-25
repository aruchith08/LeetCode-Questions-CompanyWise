import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800/80 py-5 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xs">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 21 12 15 6" />
              <polyline points="9 6 3 12 9 18" />
            </svg>
          </span>
          <p>
            <span className="font-bold text-slate-900 dark:text-neutral-100">Code<span className="text-blue-600 dark:text-blue-400">Wise</span></span> — Company-wise interview preparation · 1,446 curated questions
          </p>
        </div>
        <div className="flex items-center gap-5 text-neutral-500 dark:text-neutral-400">
          <Link to="/companies" className="hover:text-blue-600 dark:hover:text-white transition-colors">
            Companies
          </Link>
          <Link to="/problems" className="hover:text-blue-600 dark:hover:text-white transition-colors">
            Problems
          </Link>
          <Link to="/progress" className="hover:text-blue-600 dark:hover:text-white transition-colors">
            My Progress
          </Link>
          <a
            href="https://github.com/aruchith08/LeetCode-Questions-CompanyWise"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-white transition-colors"
          >
            GitHub
          </a>
          <div className="flex items-center gap-3 pl-2 border-l border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500">
            <a
              href="https://github.com/aruchith08"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-800 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-800 dark:hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-800 dark:hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
