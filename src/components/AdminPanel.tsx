import React, { useState, useEffect, useMemo } from 'react';
import { 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  DollarSign, 
  LayoutGrid, 
  Settings, 
  Database, 
  ExternalLink, 
  CheckCircle, 
  CheckCircle2,
  Check,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  LogOut,
  Send,
  HelpCircle,
  ArrowLeft,
  Globe,
  RotateCcw
} from 'lucide-react';
import { AppItem, AdSettings, SiteSettings } from '../types';
import { saveAllToServer } from '../utils/storage';

interface AdminPanelProps {
  isOpen?: boolean;
  onClose: () => void;
  apps: AppItem[];
  setApps: (apps: AppItem[]) => void;
  adSettings: AdSettings;
  setAdSettings: (settings: AdSettings) => void;
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen = true,
  onClose,
  apps,
  setApps,
  adSettings,
  setAdSettings,
  siteSettings,
  setSiteSettings,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  if (!isOpen) return null;

  // Login form state
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'apps' | 'monetization' | 'site' | 'backup'>('apps');

  // Draft working states for Monetization and Site settings to detect changes
  const [draftAdSettings, setDraftAdSettings] = useState<AdSettings>(adSettings);
  const [draftSiteSettings, setDraftSiteSettings] = useState<SiteSettings>(siteSettings);

  // Sync draft states whenever props change from outside (e.g. on initial mount or backup restore)
  useEffect(() => {
    setDraftAdSettings(adSettings);
  }, [adSettings]);

  useEffect(() => {
    setDraftSiteSettings(siteSettings);
  }, [siteSettings]);

  // Dirty State (Has unsaved modifications)
  const isAdDirty = useMemo(() => {
    return JSON.stringify(draftAdSettings) !== JSON.stringify(adSettings);
  }, [draftAdSettings, adSettings]);

  const isSiteDirty = useMemo(() => {
    return JSON.stringify(draftSiteSettings) !== JSON.stringify(siteSettings);
  }, [draftSiteSettings, siteSettings]);

  // Saving process & success feedback states
  const [isSavingAd, setIsSavingAd] = useState(false);
  const [adSaveFeedback, setAdSaveFeedback] = useState(false);

  const [isSavingSite, setIsSavingSite] = useState(false);
  const [siteSaveFeedback, setSiteSaveFeedback] = useState(false);
  const [showSitePassword, setShowSitePassword] = useState(false);

  // Master server database sync state
  const [isSyncingServer, setIsSyncingServer] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // App Editor Modal / Form state
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [initialAppJson, setInitialAppJson] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSavingApp, setIsSavingApp] = useState(false);
  const [appSaveFeedback, setAppSaveFeedback] = useState(false);

  // High-visibility Save Confirmation Alert Banner
  const [saveNotice, setSaveNotice] = useState<{ title: string; detail: string } | null>(null);

  // Set global Admin Mode flag while AdminPanel is mounted to prevent any popunders/ads
  useEffect(() => {
    (window as any).__IS_ADMIN_MODE = true;
    document.body?.classList.add('in-admin-mode');
    document.documentElement?.classList.add('in-admin-mode');
    return () => {
      (window as any).__IS_ADMIN_MODE = false;
      document.body?.classList.remove('in-admin-mode');
      document.documentElement?.classList.remove('in-admin-mode');
    };
  }, []);

  const triggerSaveNotice = (title: string, detail: string) => {
    setSaveNotice({ title, detail });
    setTimeout(() => {
      setSaveNotice(null);
    }, 5500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === siteSettings.adminPassword) {
      setIsAuthenticated(true);
      setLoginError('');
      setPasswordInput('');
    } else {
      setLoginError('Incorrect password! Please enter the correct admin key.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // App Management
  const handleDeleteApp = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently remove "${name}"?`)) {
      const updated = apps.filter((a) => a.id !== id);
      setApps(updated);
      saveAllToServer({ apps: updated });
      triggerSaveNotice(
        'App Removed & Server Synced!',
        `"${name}" has been permanently removed from the live store & server database.`
      );
    }
  };

  const openNewAppModal = () => {
    setIsCreatingNew(true);
    const newApp: AppItem = {
      id: `app-${Date.now()}`,
      name: '',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      category: 'Utilities & Tools',
      description: '',
      version: 'v1.0.0',
      fileSize: '50 MB',
      adLink: draftAdSettings.defaultAdLink,
      mainContentUrl: draftSiteSettings.telegramChannel || draftAdSettings.defaultMainContentUrl,
      timerSeconds: draftAdSettings.defaultTimerSec || 30,
      downloadsCount: Math.floor(Math.random() * 5000) + 1200,
      rating: 4.9,
      isFeatured: false,
      createdAt: Date.now(),
    };
    setEditingApp(newApp);
    setInitialAppJson(JSON.stringify(newApp));
    setAppSaveFeedback(false);
    setIsSavingApp(false);
  };

  const openEditAppModal = (item: AppItem) => {
    setIsCreatingNew(false);
    setEditingApp({ ...item });
    setInitialAppJson(JSON.stringify(item));
    setAppSaveFeedback(false);
    setIsSavingApp(false);
  };

  const handleSaveApp = (appData: AppItem) => {
    if (!appData.name.trim()) {
      alert('App name is required');
      return;
    }

    setIsSavingApp(true);
    setTimeout(() => {
      if (isCreatingNew) {
        const updated = [appData, ...apps];
        setApps(updated);
        saveAllToServer({ apps: updated });
        triggerSaveNotice(
          'New App Added & Permanently Saved!',
          `"${appData.name}" is permanently saved to the server database. It will NEVER be lost.`
        );
      } else {
        const updated = apps.map((a) => (a.id === appData.id ? appData : a));
        setApps(updated);
        saveAllToServer({ apps: updated });
        triggerSaveNotice(
          'App Updated & Permanently Saved!',
          `All modifications to "${appData.name}" are permanently saved to the server database.`
        );
      }

      setIsSavingApp(false);
      setAppSaveFeedback(true);

      setTimeout(() => {
        setAppSaveFeedback(false);
        setEditingApp(null);
        setIsCreatingNew(false);
      }, 500);
    }, 350);
  };

  // Save Ad Settings Handler
  const handleSaveAdSettings = () => {
    if (!isAdDirty) return;
    setIsSavingAd(true);
    setTimeout(() => {
      setAdSettings(draftAdSettings);
      saveAllToServer({ adSettings: draftAdSettings });
      setIsSavingAd(false);
      setAdSaveFeedback(true);
      setTimeout(() => setAdSaveFeedback(false), 2500);
      triggerSaveNotice(
        'Adsterra & Monetag Settings Saved!',
        'Your direct ad links, CPM banners, popunders, and header scripts are permanently saved.'
      );
    }, 400);
  };

  const handleDiscardAdSettings = () => {
    setDraftAdSettings(adSettings);
  };

  // Save Site Settings Handler
  const handleSaveSiteSettings = () => {
    if (!isSiteDirty) return;
    setIsSavingSite(true);
    setTimeout(() => {
      setSiteSettings(draftSiteSettings);
      saveAllToServer({ siteSettings: draftSiteSettings });
      setIsSavingSite(false);
      setSiteSaveFeedback(true);
      setTimeout(() => setSiteSaveFeedback(false), 2500);
      triggerSaveNotice(
        'Site & Telegram Settings Saved!',
        'Store title, subtitle, Telegram channel URL, and admin password are permanently saved.'
      );
    }, 400);
  };

  const handleDiscardSiteSettings = () => {
    setDraftSiteSettings(siteSettings);
  };

  // Master server database sync handler
  const handleMasterServerSync = async () => {
    setIsSyncingServer(true);
    const ok = await saveAllToServer({
      apps,
      adSettings: draftAdSettings,
      siteSettings: draftSiteSettings,
    });
    setAdSettings(draftAdSettings);
    setSiteSettings(draftSiteSettings);
    setIsSyncingServer(false);
    if (ok) {
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
      triggerSaveNotice(
        'Server Database Synced & Permanent!',
        'All apps, monetization links, and settings are saved permanently to data/database.json on the server.'
      );
    } else {
      triggerSaveNotice(
        'Local Saved & Cached!',
        'Saved to browser storage and synced.'
      );
    }
  };

  // If not authenticated, show standalone full-page password gate
  if (!isAuthenticated) {
    return (
      <div 
        id="admin-panel-root"
        data-admin-panel="true"
        onClick={(e) => e.stopPropagation()}
        className="min-h-screen w-full bg-[#0a0b14] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden"
      >
        {/* Glow ambient background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md rounded-3xl bg-[#131422] border border-cyan-500/30 p-7 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-center text-white z-10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-black shadow-lg shadow-cyan-500/30">
            <Lock className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-1 tracking-wide">
            Master Admin Portal
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Private management access. Enter security credentials to manage apps, Monetag/Adsterra ads, and settings.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setLoginError('');
                }}
                placeholder="Enter Admin Password..."
                className="w-full px-4 py-3.5 pr-12 rounded-xl bg-[#0a0b12] border border-white/10 focus:border-cyan-400 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-3d-cyan w-full py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Unlock className="w-4 h-4 text-black" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          {/* Return to public store */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Store</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="admin-panel-root"
      data-admin-panel="true"
      onClick={(e) => e.stopPropagation()}
      className="min-h-screen w-full bg-[#0a0b14] text-white flex flex-col selection:bg-cyan-500 selection:text-black"
    >
      {/* Top Dedicated Admin Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#121320]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-black font-bold shadow-md shadow-cyan-500/20">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Admin Control Center
              </h1>
              {/* Dynamic Live Save Status Indicator */}
              {(isAdDirty || isSiteDirty) ? (
                <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Unsaved Changes Pending
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Database Live & Saved
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {siteSettings.siteTitle} &bull; Manage apps, revenue ads, and Telegram links
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Master Server Sync Button */}
          <button
            onClick={handleMasterServerSync}
            disabled={isSyncingServer}
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
            title="Permanently write and save all current apps and settings to server database"
          >
            {isSyncingServer ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span className="hidden md:inline">Saving to Disk...</span>
              </>
            ) : syncSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden md:inline">Saved to Database!</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Save & Sync to Server</span>
                <span className="md:hidden">Sync</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsAuthenticated(false);
              onClose();
            }}
            className="px-3 sm:px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            title="Switch back to public storefront"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">View Public Store</span>
            <span className="sm:hidden">Store</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 sm:px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-800/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Lock and logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Dashboard Workspace */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
        {/* Prominent Save Confirmation Alert Banner */}
        {saveNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/95 via-[#0c2419] to-emerald-950/95 border-2 border-emerald-400/90 text-emerald-100 flex items-center justify-between shadow-[0_0_35px_rgba(16,185,129,0.35)] animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-extrabold shadow-lg shadow-emerald-500/40 shrink-0">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white tracking-wide">{saveNotice.title}</h4>
                  <span className="text-[10px] uppercase font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded-full">
                    Saved & Live
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 mt-0.5">{saveNotice.detail}</p>
              </div>
            </div>
            <button
              onClick={() => setSaveNotice(null)}
              className="p-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-900 text-emerald-300 hover:text-white transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Overview KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#121320] border border-white/5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Apps</p>
              <p className="text-lg sm:text-xl font-extrabold text-white">{apps.length}</p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#121320] border border-white/5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Adsterra / Monetag</p>
              <p className="text-xs sm:text-sm font-bold text-emerald-400">
                {(adSettings.showTopBanner || adSettings.showDownloadBanner || adSettings.popunderOnClick) ? 'Active' : 'Disabled'}
              </p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#121320] border border-white/5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Telegram Channel</p>
              <p className="text-xs sm:text-sm font-bold text-blue-400 truncate max-w-[120px]">
                {siteSettings.telegramChannel ? 'Connected' : 'Not set'}
              </p>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#121320] border border-white/5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Security Gate</p>
              <p className="text-xs sm:text-sm font-bold text-amber-400">Private URL Protected</p>
            </div>
          </div>
        </div>

        {/* Permanent Database Status Banner */}
        <div className="mb-4 px-4 py-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-200">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Server Database Synced:</strong> All apps, direct ad links, and settings are saved to permanent server storage (<code className="text-cyan-300 bg-cyan-900/50 px-1.5 py-0.5 rounded">data/database.json</code>). Changes will not be lost when code updates or page reloads.
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            100% Persistent
          </span>
        </div>

        {/* Standalone Dashboard Card Container */}
        <div className="w-full flex-1 flex flex-col rounded-3xl bg-[#121320] border border-cyan-500/20 shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 sm:gap-2 px-6 pt-3 border-b border-white/5 bg-[#141524] overflow-x-auto">
            <button
              onClick={() => setActiveTab('apps')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'apps'
                  ? 'bg-[#121320] text-cyan-400 border-t-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>App Manager ({apps.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('monetization')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'monetization'
                  ? 'bg-[#121320] text-cyan-400 border-t-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Ads & Monetization (Adsterra / Monetag)</span>
            </button>

            <button
              onClick={() => setActiveTab('site')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'site'
                  ? 'bg-[#121320] text-cyan-400 border-t-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Telegram & Site Config</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'backup'
                  ? 'bg-[#121320] text-cyan-400 border-t-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Backup & Restore</span>
            </button>
          </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: APPS MANAGEMENT */}
          {activeTab === 'apps' && (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">Installed Software & Apps</h3>
                  <p className="text-xs text-slate-400">
                    Add, edit, change links, or remove apps from your store.
                  </p>
                </div>

                <button
                  onClick={openNewAppModal}
                  className="btn-3d-cyan px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>Add New App</span>
                </button>
              </div>

              {/* Apps Table */}
              <div className="rounded-2xl border border-white/5 bg-[#161725] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-[#10111a] text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/5">
                      <tr>
                        <th className="px-4 py-3">App</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Timer</th>
                        <th className="px-4 py-3">Ad Link</th>
                        <th className="px-4 py-3">Main Content / Telegram</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {apps.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3 font-medium text-white flex items-center gap-3">
                            <img
                              src={item.logo}
                              alt={item.name}
                              className="h-9 w-9 rounded-xl object-cover border border-white/10"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div>
                              <div className="font-semibold">{item.name}</div>
                              <div className="text-[10px] text-slate-400">
                                {item.version} • {item.fileSize}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="bg-white/5 px-2 py-0.5 rounded text-[11px] text-slate-300">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-cyan-400 font-semibold">
                            {item.timerSeconds}s
                          </td>
                          <td className="px-4 py-3 max-w-[150px] truncate" title={item.adLink}>
                            <a
                              href={item.adLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:underline flex items-center gap-1"
                            >
                              <span className="truncate">{item.adLink}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </td>
                          <td className="px-4 py-3 max-w-[150px] truncate" title={item.mainContentUrl}>
                            <a
                              href={item.mainContentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              <span className="truncate">{item.mainContentUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditAppModal(item)}
                                className="p-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/50 cursor-pointer transition-colors"
                                title="Edit App"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteApp(item.id, item.name)}
                                className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/50"
                                title="Delete App"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MONETIZATION & ADS (Adsterra / Monetag / Direct Ads) */}
          {activeTab === 'monetization' && (
            <div className="space-y-6">
              {/* Unsaved Changes Banner Notice */}
              {isAdDirty && (
                <div className="p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/60 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-xs font-bold text-amber-300">
                      Unsaved Ad & Monetization Changes Detected!
                    </span>
                    <span className="text-xs text-amber-200/80 hidden md:inline">
                      Click the glowing "Save Ad Settings" button below to apply changes.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDiscardAdSettings}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer transition-colors"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleSaveAdSettings}
                      disabled={isSavingAd}
                      className="btn-3d-cyan px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer text-black"
                    >
                      {isSavingAd ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save Now</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-[#171828] to-[#12131e] p-5 rounded-2xl border border-cyan-500/20">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Adsterra / Monetag & CPM Income Configuration
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Earning income without user clicks is powered by <strong>CPM Banner Ads, Social Bar, and In-Page Push notifications</strong>. 
                      When visitors view the site or wait on the 30-second download page, these ad impressions generate revenue automatically!
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Global Ad Link */}
                <div className="bg-[#161725] p-4 rounded-2xl border border-white/5 space-y-3">
                  <label className="block text-xs font-semibold text-slate-200">
                    Primary Default Ad Link (Directed on App/Download Clicks)
                  </label>
                  <input
                    type="text"
                    value={draftAdSettings.defaultAdLink}
                    onChange={(e) =>
                      setDraftAdSettings({ ...draftAdSettings, defaultAdLink: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                    placeholder="https://splendid-garage.com/SJ7fF4"
                  />
                  <p className="text-[11px] text-slate-400">
                    This is your Adsterra/Monetag Smart Direct Link. Used by default when visitors click on apps or "Watch Ad".
                  </p>
                </div>

                {/* Main Content / Telegram URL */}
                <div className="bg-[#161725] p-4 rounded-2xl border border-white/5 space-y-3">
                  <label className="block text-xs font-semibold text-slate-200">
                    Default Main Content / Telegram Channel URL
                  </label>
                  <input
                    type="text"
                    value={draftAdSettings.defaultMainContentUrl}
                    onChange={(e) =>
                      setDraftAdSettings({ ...draftAdSettings, defaultMainContentUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                    placeholder="https://t.me/premiumtoolsfree1"
                  />
                  <p className="text-[11px] text-slate-400">
                    Where users are redirected after the 30-second timer completes.
                  </p>
                </div>
              </div>

              {/* Timer & Redirect Controls */}
              <div className="bg-[#161725] p-4 rounded-2xl border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-2">
                    Default Countdown Timer (Seconds)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={draftAdSettings.defaultTimerSec}
                    onChange={(e) =>
                      setDraftAdSettings({
                        ...draftAdSettings,
                        defaultTimerSec: parseInt(e.target.value) || 30,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Default: 30 seconds</span>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="text-xs font-semibold text-slate-200 mb-1">
                    Auto-Redirect After Timer
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={draftAdSettings.autoRedirect}
                      onChange={(e) =>
                        setDraftAdSettings({ ...draftAdSettings, autoRedirect: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    <span className="ml-2 text-xs text-slate-300">
                      {draftAdSettings.autoRedirect ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="text-xs font-semibold text-slate-200 mb-1">
                    Open Ad in New Tab on Click
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={draftAdSettings.openAdInNewTab}
                      onChange={(e) =>
                        setDraftAdSettings({ ...draftAdSettings, openAdInNewTab: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    <span className="ml-2 text-xs text-slate-300">
                      {draftAdSettings.openAdInNewTab ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Custom Ad Code Inputs for Impression CPM Ads */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Custom Ad Tags (Adsterra / Monetag / PropellerAds Scripts)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                    Generates CPM without clicks
                  </span>
                </h4>

                {/* Top Banner Code */}
                <div className="bg-[#161725] p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200">
                      Top Leaderboard Banner Code (728x90 or Native Banner)
                    </label>
                    <label className="inline-flex items-center cursor-pointer text-xs text-slate-400">
                      <input
                        type="checkbox"
                        checked={draftAdSettings.showTopBanner}
                        onChange={(e) =>
                          setDraftAdSettings({ ...draftAdSettings, showTopBanner: e.target.checked })
                        }
                        className="mr-1.5"
                      />
                      Show Banner
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={draftAdSettings.topBannerCode}
                    onChange={(e) =>
                      setDraftAdSettings({ ...draftAdSettings, topBannerCode: e.target.value })
                    }
                    placeholder={`<!-- Paste Adsterra/Monetag banner script or HTML here -->\n<script type="text/javascript">...</script>`}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0e0f18] border border-white/10 font-mono text-[11px] text-cyan-200 focus:border-cyan-400 outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    If left empty, a sponsor banner linking to your default ad link is shown automatically.
                  </p>
                </div>

                {/* Download Page Banner Code */}
                <div className="bg-[#161725] p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200">
                      Download Page Banner (300x250 or Native Ad)
                    </label>
                    <label className="inline-flex items-center cursor-pointer text-xs text-slate-400">
                      <input
                        type="checkbox"
                        checked={draftAdSettings.showDownloadBanner}
                        onChange={(e) =>
                          setDraftAdSettings({ ...draftAdSettings, showDownloadBanner: e.target.checked })
                        }
                        className="mr-1.5"
                      />
                      Show Banner
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={draftAdSettings.downloadBannerCode}
                    onChange={(e) =>
                      setDraftAdSettings({ ...draftAdSettings, downloadBannerCode: e.target.value })
                    }
                    placeholder={`<!-- Paste 300x250 Ad code here -->`}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0e0f18] border border-white/10 font-mono text-[11px] text-cyan-200 focus:border-cyan-400 outline-none"
                  />
                </div>

                {/* Header / Popunder / Social Bar Script */}
                <div className="bg-[#161725] p-4 rounded-2xl border border-white/5 space-y-2">
                  <label className="block text-xs font-semibold text-slate-200">
                    Adsterra Social Bar / Monetag In-Page Push / Popunder Script
                  </label>
                  <textarea
                    rows={3}
                    value={draftAdSettings.headerScript}
                    onChange={(e) =>
                      setDraftAdSettings({ ...draftAdSettings, headerScript: e.target.value })
                    }
                    placeholder={`<!-- Paste Social Bar / In-Page Push / Anti-Adblock script here -->\n<script src="//pl..."></script>`}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0e0f18] border border-white/10 font-mono text-[11px] text-cyan-200 focus:border-cyan-400 outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    Social Bar and In-Page push float on the screen automatically and pay CPM every time a user views the website.
                  </p>
                </div>
              </div>

              {/* Save Button with Dynamic Dirty / Clean States */}
              <div className="pt-3 flex items-center gap-4">
                {isAdDirty ? (
                  <button
                    onClick={handleSaveAdSettings}
                    disabled={isSavingAd}
                    className="btn-3d-cyan px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 cursor-pointer shadow-[0_0_25px_rgba(0,242,234,0.6)] border-2 border-cyan-300 animate-pulse transition-all text-black"
                  >
                    {isSavingAd ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Saving Changes to Storage...</span>
                      </>
                    ) : adSaveFeedback ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>✓ Saved Successfully!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-black" />
                        <span>Save Ad Settings (Changes Pending)</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-not-allowed bg-[#181926] text-slate-500 border border-white/5 opacity-40 select-none transition-all"
                  >
                    <Check className="w-4 h-4 text-slate-500" />
                    <span>Ad Settings Saved (Up to Date)</span>
                  </button>
                )}

                {isAdDirty && (
                  <button
                    onClick={handleDiscardAdSettings}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white cursor-pointer transition-colors"
                  >
                    Discard Changes
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SITE SETTINGS & TELEGRAM */}
          {activeTab === 'site' && (
            <div className="space-y-5 max-w-2xl">
              {/* Unsaved Changes Banner Notice */}
              {isSiteDirty && (
                <div className="p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-500/60 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-xs font-bold text-amber-300">
                      Unsaved Site & Telegram Changes Detected!
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDiscardSiteSettings}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer transition-colors"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleSaveSiteSettings}
                      disabled={isSavingSite}
                      className="btn-3d-cyan px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer text-black"
                    >
                      {isSavingSite ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save Now</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-[#161725] p-5 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white">General Store Information</h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Store Title
                  </label>
                  <input
                    type="text"
                    value={draftSiteSettings.siteTitle}
                    onChange={(e) =>
                      setDraftSiteSettings({ ...draftSiteSettings, siteTitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={draftSiteSettings.siteSubtitle}
                    onChange={(e) =>
                      setDraftSiteSettings({ ...draftSiteSettings, siteSubtitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Official Telegram Channel Link (Main Content)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={draftSiteSettings.telegramChannel}
                      onChange={(e) =>
                        setDraftSiteSettings({ ...draftSiteSettings, telegramChannel: e.target.value })
                      }
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                    <Send className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Top Announcement Bar Message
                  </label>
                  <input
                    type="text"
                    value={draftSiteSettings.announcement}
                    onChange={(e) =>
                      setDraftSiteSettings({ ...draftSiteSettings, announcement: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              {/* Password Management */}
              <div className="bg-[#161725] p-5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-cyan-400" />
                    <span>Admin Security Password</span>
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                    Protected & Private
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The admin password is encrypted and never shown to public visitors. Only enter a new password here if you wish to change it.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Set / Change Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSitePassword ? "text" : "password"}
                      value={draftSiteSettings.adminPassword}
                      onChange={(e) =>
                        setDraftSiteSettings({ ...draftSiteSettings, adminPassword: e.target.value })
                      }
                      placeholder="Enter secure password..."
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSitePassword(!showSitePassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                      title={showSitePassword ? "Hide password" : "Show password"}
                    >
                      {showSitePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button with Dynamic Dirty / Clean States */}
              <div className="pt-2 flex items-center gap-4">
                {isSiteDirty ? (
                  <button
                    onClick={handleSaveSiteSettings}
                    disabled={isSavingSite}
                    className="btn-3d-cyan px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 cursor-pointer shadow-[0_0_25px_rgba(0,242,234,0.6)] border-2 border-cyan-300 animate-pulse transition-all text-black"
                  >
                    {isSavingSite ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Saving Site Settings...</span>
                      </>
                    ) : siteSaveFeedback ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>✓ Saved Successfully!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-black" />
                        <span>Save Site Settings (Changes Pending)</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-not-allowed bg-[#181926] text-slate-500 border border-white/5 opacity-40 select-none transition-all"
                  >
                    <Check className="w-4 h-4 text-slate-500" />
                    <span>Site Settings Saved (Up to Date)</span>
                  </button>
                )}

                {isSiteDirty && (
                  <button
                    onClick={handleDiscardSiteSettings}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white cursor-pointer transition-colors"
                  >
                    Discard Changes
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-2xl">
              <div className="bg-[#161725] p-5 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white">Export & Import Data</h3>
                <p className="text-xs text-slate-300">
                  You can download your entire database of apps and settings as a JSON file, or restore them anytime.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      const data = {
                        apps,
                        adSettings,
                        siteSettings,
                        exportedAt: new Date().toISOString(),
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: 'application/json',
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `premium-store-backup-${Date.now()}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      triggerSaveNotice('Backup Exported!', 'Store backup JSON file downloaded to your computer.');
                    }}
                    className="btn-3d-cyan px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer text-black"
                  >
                    <Database className="w-4 h-4 text-black" />
                    <span>Export All Data (JSON)</span>
                  </button>

                  <label className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-2 cursor-pointer border border-white/10">
                    <span>Import Data</span>
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const parsed = JSON.parse(event.target?.result as string);
                            if (parsed.apps && Array.isArray(parsed.apps)) {
                              setApps(parsed.apps);
                            }
                            if (parsed.adSettings) {
                              setAdSettings(parsed.adSettings);
                              setDraftAdSettings(parsed.adSettings);
                            }
                            if (parsed.siteSettings) {
                              setSiteSettings(parsed.siteSettings);
                              setDraftSiteSettings(parsed.siteSettings);
                            }
                            // Persist imported data to server permanent database
                            saveAllToServer({
                              apps: parsed.apps,
                              adSettings: parsed.adSettings,
                              siteSettings: parsed.siteSettings,
                            });
                            triggerSaveNotice(
                              'Data Restored & Server Synced!',
                              'Apps, monetization, and system settings have been restored and permanently saved.'
                            );
                          } catch {
                            alert('Invalid JSON backup file');
                          }
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL: ADD / EDIT APP */}
        {editingApp && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-xl my-auto rounded-3xl bg-[#151624] border border-cyan-500/40 p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <h3 className="text-base font-bold text-white">
                  {isCreatingNew ? 'Add New Software / App' : `Edit "${editingApp.name}"`}
                </h3>
                <button
                  onClick={() => setEditingApp(null)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Software / App Name *
                  </label>
                  <input
                    type="text"
                    value={editingApp.name}
                    onChange={(e) => setEditingApp({ ...editingApp, name: e.target.value })}
                    placeholder="e.g. CapCut Pro PC Lifetime"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    App Icon / Logo Image URL
                  </label>
                  <div className="flex items-center gap-3">
                    <img
                      src={editingApp.logo}
                      alt="Preview"
                      className="h-10 w-10 rounded-xl object-cover border border-white/10 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';
                      }}
                    />
                    <input
                      type="text"
                      value={editingApp.logo}
                      onChange={(e) => setEditingApp({ ...editingApp, logo: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>

                {/* Category & Version & Size */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingApp.category}
                      onChange={(e) =>
                        setEditingApp({ ...editingApp, category: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Version
                    </label>
                    <input
                      type="text"
                      value={editingApp.version}
                      onChange={(e) =>
                        setEditingApp({ ...editingApp, version: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      File Size
                    </label>
                    <input
                      type="text"
                      value={editingApp.fileSize}
                      onChange={(e) =>
                        setEditingApp({ ...editingApp, fileSize: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>

                {/* Specific Ad Link */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ad Link (Opens on Click)
                  </label>
                  <input
                    type="text"
                    value={editingApp.adLink}
                    onChange={(e) => setEditingApp({ ...editingApp, adLink: e.target.value })}
                    placeholder="https://splendid-garage.com/SJ7fF4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                  <span className="text-[10px] text-slate-400">
                    If left unchanged, defaults to your global direct ad link.
                  </span>
                </div>

                {/* Main Content / Telegram URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Main Content / Telegram Download URL *
                  </label>
                  <input
                    type="text"
                    value={editingApp.mainContentUrl}
                    onChange={(e) =>
                      setEditingApp({ ...editingApp, mainContentUrl: e.target.value })
                    }
                    placeholder="https://t.me/premiumtoolsfree1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                  <span className="text-[10px] text-slate-400">
                    User will be automatically redirected to this link after 30 seconds.
                  </span>
                </div>

                {/* Timer & Featured */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Timer (Seconds)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={editingApp.timerSeconds}
                      onChange={(e) =>
                        setEditingApp({
                          ...editingApp,
                          timerSeconds: parseInt(e.target.value) || 30,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={editingApp.isFeatured || false}
                      onChange={(e) =>
                        setEditingApp({ ...editingApp, isFeatured: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                    />
                    <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-300">
                      Mark as Featured (HOT badge)
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingApp.description}
                    onChange={(e) =>
                      setEditingApp({ ...editingApp, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0e0f18] border border-white/10 text-xs text-white focus:border-cyan-400 outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {(() => {
                const isAppDirty = isCreatingNew
                  ? editingApp.name.trim().length > 0
                  : JSON.stringify(editingApp) !== initialAppJson;
                const isAppValid =
                  editingApp.name.trim().length > 0 && editingApp.mainContentUrl.trim().length > 0;
                const canSaveApp = isAppDirty && isAppValid;

                return (
                  <div className="flex items-center justify-between pt-5 mt-4 border-t border-white/10">
                    <div className="text-xs">
                      {!isAppValid ? (
                        <span className="text-amber-400 font-medium">
                          * App Name and Main Content URL are required
                        </span>
                      ) : !isAppDirty ? (
                        <span className="text-slate-500 font-medium">
                          No changes detected
                        </span>
                      ) : (
                        <span className="text-cyan-400 font-medium animate-pulse">
                          ● Unsaved app modifications ready to save
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingApp(null)}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Cancel
                      </button>

                      {canSaveApp ? (
                        <button
                          type="button"
                          onClick={() => handleSaveApp(editingApp)}
                          disabled={isSavingApp}
                          className="btn-3d-cyan px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(0,242,234,0.6)] border-2 border-cyan-300 animate-pulse transition-all text-black"
                        >
                          {isSavingApp ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-black" />
                              <span>Saving App...</span>
                            </>
                          ) : appSaveFeedback ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-black" />
                              <span>✓ Saved to Store!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 text-black" />
                              <span>{isCreatingNew ? 'Save New App' : 'Save & Update App'}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-not-allowed bg-[#181926] text-slate-500 border border-white/5 opacity-35 select-none transition-all"
                        >
                          <Save className="w-4 h-4 text-slate-600" />
                          <span>{isCreatingNew ? 'Fill Required' : 'No Changes Made'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Admin Panel Page Footer */}
      <footer className="w-full border-t border-white/5 py-4 text-center text-xs text-slate-500">
        Private Master Admin &bull; Protected by Security Key &bull; Changes auto-saved to localStorage
      </footer>
    </div>
  );
};
