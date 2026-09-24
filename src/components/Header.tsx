import React from 'react';
import { Search, Send, Lock, Sparkles, X } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeaderProps {
  siteSettings: SiteSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  siteSettings,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  onOpenAdmin,
}) => {
  return (
    <header className="w-full">
      {/* Top Announcement Bar */}
      {siteSettings.announcement && (
        <div className="w-full bg-gradient-to-r from-[#0d1b2a] via-[#102a43] to-[#0d1b2a] border-b border-cyan-500/20 py-1.5 px-4 text-center text-xs font-medium text-cyan-200">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="truncate">{siteSettings.announcement}</span>
            <a
              href={siteSettings.telegramChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 underline font-semibold text-cyan-300 hover:text-white shrink-0"
            >
              Join Now &rarr;
            </a>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Title (Owner can double-click logo or use ?page=admin) */}
          <div 
            className="flex items-center gap-3 cursor-default select-none"
            onDoubleClick={onOpenAdmin}
            title={siteSettings.siteTitle}
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-600 flex items-center justify-center text-black font-extrabold text-xl shadow-[0_0_20px_rgba(0,242,234,0.4)] border border-white/20">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-wider text-white uppercase drop-shadow-[0_2px_8px_rgba(0,242,234,0.4)]">
                {siteSettings.siteTitle}
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                {siteSettings.siteSubtitle}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Telegram Channel Button */}
            <a
              href={siteSettings.telegramChannel}
              target="_blank"
              rel="noopener noreferrer"
              id="telegram-header-btn"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#229ED9] to-[#0088cc] hover:from-[#1e8ec5] hover:to-[#0077b5] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#229ED9]/25 transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span className="hidden md:inline">Telegram Channel</span>
              <span className="md:hidden">Telegram</span>
            </a>
          </div>
        </div>

        {/* Hero Section & Search */}
        <div className="mt-8 mb-6 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">100% Working</span> Apps
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Free premium software, unlocked VIP tools, and verified APKs. Instant access via safe download servers.
          </p>

          {/* Search Bar */}
          <div className="mt-5 relative max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search software, apps, or tools..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#141522] border border-white/10 focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-400/20 text-sm text-white placeholder-slate-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold shadow-md shadow-cyan-400/25 scale-105'
                  : 'bg-[#151622] hover:bg-[#1e2030] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
