import React, { useState, useEffect, useMemo } from 'react';
import { 
  getStoredApps, 
  saveStoredApps, 
  getAdSettings, 
  saveAdSettings, 
  getSiteSettings, 
  saveSiteSettings,
  isAdminAuthenticated,
  setAdminAuthenticated,
  canTriggerPopunder,
  recordPopunderTrigger,
  fetchServerData
} from './utils/storage';
import { AppItem, AdSettings, SiteSettings } from './types';
import { Header } from './components/Header';
import { AppCard } from './components/AppCard';
import { DownloadModal } from './components/DownloadModal';
import { AdminPanel } from './components/AdminPanel';
import { AdContainer } from './components/AdContainer';
import { TelegramFloatingButton } from './components/TelegramFloatingButton';
import { Sparkles, Send, ShieldAlert, Lock } from 'lucide-react';

const checkIsAdminUrl = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const search = window.location.search.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' ||
    path === '/admin/' ||
    path.endsWith('/admin') ||
    path.endsWith('/admin/') ||
    path.includes('/admin') ||
    search.includes('page=admin') ||
    search.includes('admin=true') ||
    search.includes('?admin') ||
    search.includes('&admin') ||
    hash.includes('admin')
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<'store' | 'admin'>(() => (checkIsAdminUrl() ? 'admin' : 'store'));
  const [apps, setAppsState] = useState<AppItem[]>(getStoredApps);
  const [adSettings, setAdSettingsState] = useState<AdSettings>(getAdSettings);
  const [siteSettings, setSiteSettingsState] = useState<SiteSettings>(getSiteSettings);
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);

  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Persistence wrappers
  const setApps = (newApps: AppItem[]) => {
    setAppsState(newApps);
    saveStoredApps(newApps);
  };

  const setAdSettings = (newSettings: AdSettings) => {
    setAdSettingsState(newSettings);
    saveAdSettings(newSettings);
  };

  const setSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettingsState(newSettings);
    saveSiteSettings(newSettings);
  };

  const setIsAuthenticated = (auth: boolean) => {
    setIsAuthenticatedState(auth);
    setAdminAuthenticated(auth);
  };

  // Route switcher with real URL path synchronization
  const navigateTo = (view: 'store' | 'admin') => {
    setCurrentView(view);
    (window as any).__IS_ADMIN_MODE = (view === 'admin');
    if (view === 'store') {
      setIsAuthenticatedState(false);
      setAdminAuthenticated(false);
    }
    try {
      if (view === 'admin') {
        window.history.pushState({ view: 'admin' }, '', '/admin');
      } else {
        window.history.pushState({ view: 'store' }, '', '/');
      }
    } catch {
      const url = new URL(window.location.href);
      if (view === 'admin') {
        url.searchParams.set('page', 'admin');
      } else {
        url.searchParams.delete('page');
        url.searchParams.delete('admin');
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  // Synchronize global Admin Mode state for ad blocking shield
  useEffect(() => {
    const isAdmin = currentView === 'admin' || checkIsAdminUrl();
    (window as any).__IS_ADMIN_MODE = isAdmin;
  }, [currentView]);

  // Listen to browser history changes (back/forward & hash changes)
  useEffect(() => {
    const handleUrlChange = () => {
      const isAdmin = checkIsAdminUrl();
      setCurrentView(isAdmin ? 'admin' : 'store');
      if (!isAdmin) {
        setIsAuthenticatedState(false);
        setAdminAuthenticated(false);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Sync with permanent server database on mount
  useEffect(() => {
    fetchServerData().then((serverData) => {
      if (serverData) {
        if (Array.isArray(serverData.apps) && serverData.apps.length > 0) {
          setAppsState(serverData.apps);
        }
        if (serverData.adSettings) {
          setAdSettingsState(serverData.adSettings);
        }
        if (serverData.siteSettings) {
          setSiteSettingsState(serverData.siteSettings);
        }
      }
    });
  }, []);

  // Check URL params for direct link to an app (?id=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');

    if (idParam) {
      const found = apps.find((a) => a.id === idParam);
      if (found) {
        setSelectedApp(found);
      }
    }
  }, [apps]);

  // Secret keyboard shortcut: Ctrl + Shift + A toggles Standalone Admin Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        navigateTo(currentView === 'admin' ? 'store' : 'admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  // Monetag/Adsterra Header Script injection
  useEffect(() => {
    if (adSettings.headerScript && adSettings.headerScript.trim().length > 0) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = adSettings.headerScript;
      const scripts = wrapper.querySelectorAll('script');

      scripts.forEach((s) => {
        const scriptEl = document.createElement('script');
        Array.from(s.attributes).forEach((attr) => {
          scriptEl.setAttribute(attr.name, attr.value);
        });
        scriptEl.innerHTML = s.innerHTML;
        document.head.appendChild(scriptEl);
      });
    }
  }, [adSettings.headerScript]);

  // First click popunder revenue trigger (Monetag / Adsterra style)
  const handleGlobalClick = () => {
    if (adSettings.popunderOnClick && canTriggerPopunder(adSettings.popunderCooldownMinutes || 1)) {
      try {
        const adUrl = adSettings.defaultAdLink;
        if (adUrl) {
          const win = window.open(adUrl, '_blank');
          if (win) {
            recordPopunderTrigger();
          }
        }
      } catch (err) {
        console.log("Popunder blocked", err);
      }
    }
  };

  // App Categories list
  const categories = useMemo(() => {
    const cats = new Set<string>();
    cats.add('All');
    apps.forEach((app) => {
      if (app.category) cats.add(app.category);
    });
    return Array.from(cats);
  }, [apps]);

  // Filtered Apps
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'All' || app.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [apps, searchQuery, selectedCategory]);

  const handleSelectApp = (app: AppItem) => {
    // Open direct ad link if configured
    if (adSettings.openAdInNewTab) {
      try {
        const adLinkToOpen = app.adLink || adSettings.defaultAdLink;
        window.open(adLinkToOpen, '_blank');
      } catch (e) {
        console.log("Ad click blocked", e);
      }
    }

    setSelectedApp(app);

    // Update browser URL silently
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('id', app.id);
      window.history.pushState({}, '', url.toString());
    } catch {
      // Ignore in strict iframes
    }
  };

  const handleCloseDownload = () => {
    setSelectedApp(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      window.history.pushState({}, '', url.toString());
    } catch {
      // Ignore
    }
  };

  // If current view is standalone Master Admin Panel
  if (currentView === 'admin') {
    return (
      <AdminPanel
        onClose={() => navigateTo('store')}
        apps={apps}
        setApps={setApps}
        adSettings={adSettings}
        setAdSettings={setAdSettings}
        siteSettings={siteSettings}
        setSiteSettings={setSiteSettings}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col bg-[#0b0c12] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,242,234,0.12),rgba(255,255,255,0))] text-white selection:bg-[#00f2ea] selection:text-black"
      onClick={handleGlobalClick}
    >
      {/* Header */}
      <Header
        siteSettings={siteSettings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        onOpenAdmin={() => navigateTo('admin')}
      />

      {/* Top Banner Ad Container (CPM Impression Monetization) */}
      {adSettings.showTopBanner && (
        <AdContainer
          type="topBanner"
          customCode={adSettings.topBannerCode}
          defaultAdLink={adSettings.defaultAdLink}
        />
      )}

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Section Title */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold tracking-wide uppercase text-white">
              {selectedCategory === 'All' ? 'All Verified Applications' : selectedCategory}
            </h3>
            <span className="text-xs font-semibold bg-white/5 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
              {filteredApps.length} Apps
            </span>
          </div>

          <a
            href={siteSettings.telegramChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 hover:underline"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Request an App</span>
          </a>
        </div>

        {/* App Grid */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onSelectApp={handleSelectApp}
                defaultAdLink={adSettings.defaultAdLink}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-3xl bg-[#12131d] border border-white/5 p-8 max-w-md mx-auto">
            <ShieldAlert className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">No apps found</h4>
            <p className="text-xs text-slate-400 mb-4">
              We couldn't find any software matching "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="btn-3d-cyan px-4 py-2 rounded-xl text-xs font-bold"
            >
              Clear Search & Filter
            </button>
          </div>
        )}
      </main>

      {/* Floating Telegram Channel CTA Button */}
      <TelegramFloatingButton telegramUrl={siteSettings.telegramChannel} />

      {/* Download / Unlock 30s Countdown Modal */}
      {selectedApp && (
        <DownloadModal
          app={selectedApp}
          adSettings={adSettings}
          siteSettings={siteSettings}
          onClose={handleCloseDownload}
        />
      )}

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-[#0e0f17] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{siteSettings.siteTitle}</span>
            <span>•</span>
            <span>All software files are safe & verified</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={siteSettings.telegramChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Community</span>
            </a>

            {/* Direct Admin Portal link */}
            <button
              onClick={() => {
                setIsAuthenticated(false);
                navigateTo('admin');
              }}
              id="admin-footer-link"
              className="hover:text-cyan-400 text-slate-500 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              title="Admin Portal (/admin)"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
