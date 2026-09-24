import { AppItem, AdSettings, SiteSettings } from '../types';

export const DEFAULT_AD_LINK = "https://splendid-garage.com/SJ7fF4";
export const OLD_AD_LINK = "https://data527.click/3421c9af17a0973e4bbb/537ad80f08/?placementName=default";
export const DEFAULT_MAIN_CONTENT_URL = "https://t.me/premiumtoolsfree1";
export const DEFAULT_ADMIN_PASSWORD = "Aa123456@";

export const DEFAULT_AD_SETTINGS: AdSettings = {
  defaultAdLink: DEFAULT_AD_LINK,
  defaultMainContentUrl: DEFAULT_MAIN_CONTENT_URL,
  defaultTimerSec: 30,
  autoRedirect: true,
  openAdInNewTab: true,
  popunderOnClick: true,
  popunderCooldownMinutes: 1,
  headerScript: "",
  topBannerCode: "",
  downloadBannerCode: "",
  floatingSocialBarCode: "",
  showTopBanner: true,
  showDownloadBanner: true,
  enableImpressionBoost: true,
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteTitle: "PREMIUM STORE",
  siteSubtitle: "100% Working Apps & Tools Download",
  telegramChannel: "https://t.me/premiumtoolsfree1",
  announcement: "🔥 New Premium Tools Added! Join our Telegram Channel for direct updates & instant software keys.",
  adminPassword: DEFAULT_ADMIN_PASSWORD,
};

export const INITIAL_APPS: AppItem[] = [
  {
    id: "app-1",
    name: "Canva Pro Lifetime 2025",
    logo: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=200&auto=format&fit=crop&q=80",
    category: "Design & Creative",
    description: "Unlimited premium templates, brand kits, AI magic studio, and background remover unlocked.",
    version: "v4.92.0",
    fileSize: "48 MB",
    adLink: DEFAULT_AD_LINK,
    mainContentUrl: DEFAULT_MAIN_CONTENT_URL,
    timerSeconds: 30,
    downloadsCount: 14820,
    rating: 4.9,
    isFeatured: true,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "app-2",
    name: "CapCut Pro PC No Watermark",
    logo: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&auto=format&fit=crop&q=80",
    category: "Video Editing",
    description: "Full version with all VIP transitions, auto-captions, 4K 60FPS export without any watermark.",
    version: "v5.1.0 PC",
    fileSize: "512 MB",
    adLink: DEFAULT_AD_LINK,
    mainContentUrl: DEFAULT_MAIN_CONTENT_URL,
    timerSeconds: 30,
    downloadsCount: 28940,
    rating: 5.0,
    isFeatured: true,
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: "app-3",
    name: "Adobe Photoshop 2025 Pre-Activated",
    logo: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=200&auto=format&fit=crop&q=80",
    category: "Design & Creative",
    description: "Full lifetime activated Photoshop with Generative Fill AI, Neural filters, and multilingual package.",
    version: "v26.0 Multilingual",
    fileSize: "3.2 GB",
    adLink: DEFAULT_AD_LINK,
    mainContentUrl: DEFAULT_MAIN_CONTENT_URL,
    timerSeconds: 30,
    downloadsCount: 39500,
    rating: 4.9,
    isFeatured: true,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "app-4",
    name: "Wondershare Filmora 13 VIP",
    logo: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=200&auto=format&fit=crop&q=80",
    category: "Video Editing",
    description: "All AI effects unlocked, speed ramping, keyframe audio ducking, and no subscription required.",
    version: "v13.6.4",
    fileSize: "490 MB",
    adLink: DEFAULT_AD_LINK,
    mainContentUrl: DEFAULT_MAIN_CONTENT_URL,
    timerSeconds: 30,
    downloadsCount: 19300,
    rating: 4.8,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "app-5",
    name: "Internet Download Manager (IDM) 6.42",
    logo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200&auto=format&fit=crop&q=80",
    category: "Utilities & Tools",
    description: "Maximum 5x download acceleration, video grabber browser integration, and permanent patch included.",
    version: "v6.42 Build 18",
    fileSize: "18 MB",
    adLink: DEFAULT_AD_LINK,
    mainContentUrl: DEFAULT_MAIN_CONTENT_URL,
    timerSeconds: 30,
    downloadsCount: 52100,
    rating: 5.0,
    isFeatured: true,
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: "app-6",
    name: "ChatGPT Plus & AI Prompt Tools",
    logo: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=200&auto=format&fit=crop&q=80",
    category: "AI & Productivity",
    description: "Exclusive AI prompt suites, Telegram AI automation bots, and full access guides.",
    version: "v2.5 Suite",
    fileSize: "32 MB",
    adLink: DEFAULT_AD_LINK,
    mainContentUrl: DEFAULT_MAIN_CONTENT_URL,
    timerSeconds: 30,
    downloadsCount: 17400,
    rating: 4.9,
    createdAt: Date.now() - 86400000,
  },
  {
    id: "app-7",
    name: "NordVPN Premium Unlimited",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&auto=format&fit=crop&q=80",
    category: "Security & VPN",
    description: "High speed 10Gbps servers across 60+ countries, Threat Protection, and Zero-Log DNS.",
    version: "v7.19.2",
    fileSize: "64 MB",
    adLink: DEFAULT_AD_LINK,
    mainContentUrl: DEFAULT_MAIN_CONTENT_URL,
    timerSeconds: 30,
    downloadsCount: 31200,
    rating: 4.8,
    createdAt: Date.now() - 86400000,
  },
  {
    id: "app-8",
    name: "Telegram Multi-Account Bot Manager",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
    category: "Utilities & Tools",
    description: "Automate Telegram channel postings, member invites, scheduled auto-replies, and scraping.",
    version: "v3.1.2 Pro",
    fileSize: "85 MB",
    adLink: DEFAULT_AD_LINK,
    mainContentUrl: DEFAULT_MAIN_CONTENT_URL,
    timerSeconds: 30,
    downloadsCount: 12600,
    rating: 4.9,
    createdAt: Date.now(),
  },
];

const STORAGE_KEYS = {
  APPS: "ps_apps_v2",
  ADS: "ps_ad_settings_v2",
  SITE: "ps_site_settings_v2",
  ADMIN_SESSION: "ps_admin_session_auth",
  POPUNDER_LAST_TRIGGER: "ps_popunder_last_trigger",
};

export function getStoredApps(): AppItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPS);
    if (!raw) {
      saveStoredApps(INITIAL_APPS);
      return INITIAL_APPS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      let migrated = false;
      const apps = parsed.map((app: AppItem) => {
        if (app.adLink === OLD_AD_LINK) {
          migrated = true;
          return { ...app, adLink: DEFAULT_AD_LINK };
        }
        return app;
      });
      if (migrated) {
        saveStoredApps(apps);
      }
      return apps;
    }
    saveStoredApps(INITIAL_APPS);
    return INITIAL_APPS;
  } catch (err) {
    console.error("Error reading apps from storage", err);
    return INITIAL_APPS;
  }
}

export function saveStoredApps(apps: AppItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
    // Asynchronously save to server permanent database
    fetch('/api/apps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apps }),
    }).catch((err) => console.warn('Background server apps sync failed:', err));
  } catch (err) {
    console.error("Error saving apps to storage", err);
  }
}

export function getAdSettings(): AdSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADS);
    if (!raw) {
      saveAdSettings(DEFAULT_AD_SETTINGS);
      return DEFAULT_AD_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_AD_SETTINGS, ...parsed };
    if (merged.defaultAdLink === OLD_AD_LINK) {
      merged.defaultAdLink = DEFAULT_AD_LINK;
      saveAdSettings(merged);
    }
    return merged;
  } catch (err) {
    console.error("Error reading ad settings from storage", err);
    return DEFAULT_AD_SETTINGS;
  }
}

export function saveAdSettings(settings: AdSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(settings));
    // Asynchronously save to server permanent database
    fetch('/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adSettings: settings }),
    }).catch((err) => console.warn('Background server ad sync failed:', err));
  } catch (err) {
    console.error("Error saving ad settings to storage", err);
  }
}

export function getSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SITE);
    if (!raw) {
      saveSiteSettings(DEFAULT_SITE_SETTINGS);
      return DEFAULT_SITE_SETTINGS;
    }
    return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error("Error reading site settings from storage", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SITE, JSON.stringify(settings));
    // Asynchronously save to server permanent database
    fetch('/api/site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteSettings: settings }),
    }).catch((err) => console.warn('Background server site sync failed:', err));
  } catch (err) {
    console.error("Error saving site settings to storage", err);
  }
}

export interface ServerDataResponse {
  apps: AppItem[];
  adSettings: AdSettings;
  siteSettings: SiteSettings;
  updatedAt?: number;
}

// Fetch all persistent data from the backend server
export async function fetchServerData(): Promise<ServerDataResponse | null> {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      const data: ServerDataResponse = json.data;
      if (Array.isArray(data.apps) && data.apps.length > 0) {
        localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(data.apps));
      }
      if (data.adSettings) {
        localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(data.adSettings));
      }
      if (data.siteSettings) {
        localStorage.setItem(STORAGE_KEYS.SITE, JSON.stringify(data.siteSettings));
      }
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch from server API, using local storage fallback:', err);
  }
  return null;
}

// Save all data directly to the server's permanent database file
export async function saveAllToServer(payload: {
  apps?: AppItem[];
  adSettings?: AdSettings;
  siteSettings?: SiteSettings;
}): Promise<boolean> {
  try {
    // 1. Immediately write to localStorage
    if (payload.apps) {
      localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(payload.apps));
    }
    if (payload.adSettings) {
      localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(payload.adSettings));
    }
    if (payload.siteSettings) {
      localStorage.setItem(STORAGE_KEYS.SITE, JSON.stringify(payload.siteSettings));
    }

    // 2. Persist to server permanent disk storage via /api/save
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      return json.success === true;
    }
  } catch (err) {
    console.error('Error saving to server API:', err);
  }
  return false;
}

export function isAdminAuthenticated(): boolean {
  // Always return false so visiting /admin strictly asks for password every session/visit
  return false;
}

export function setAdminAuthenticated(auth: boolean): void {
  try {
    if (!auth) {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  } catch (err) {
    console.error("Error setting admin session", err);
  }
}

export function canTriggerPopunder(cooldownMinutes: number = 1): boolean {
  try {
    const last = localStorage.getItem(STORAGE_KEYS.POPUNDER_LAST_TRIGGER);
    if (!last) return true;
    const diffMs = Date.now() - parseInt(last, 10);
    return diffMs > cooldownMinutes * 60 * 1000;
  } catch {
    return true;
  }
}

export function recordPopunderTrigger(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POPUNDER_LAST_TRIGGER, Date.now().toString());
  } catch (err) {
    console.error("Error recording popunder", err);
  }
}

export function resetAllToDefaults(): void {
  saveStoredApps(INITIAL_APPS);
  saveAdSettings(DEFAULT_AD_SETTINGS);
  saveSiteSettings(DEFAULT_SITE_SETTINGS);
}
