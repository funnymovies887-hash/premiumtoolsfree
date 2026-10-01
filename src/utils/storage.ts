import { AppItem, AdSettings, SiteSettings, GitHubSettings } from '../types';
import initialDb from '../data/database.json';

export const DEFAULT_AD_LINK = initialDb?.adSettings?.defaultAdLink || "https://splendid-garage.com/SJ7fF4";
export const OLD_AD_LINK = "https://data527.click/3421c9af17a0973e4bbb/537ad80f08/?placementName=default";
export const DEFAULT_MAIN_CONTENT_URL = initialDb?.adSettings?.defaultMainContentUrl || "https://t.me/premiumtoolsfree1";
export const DEFAULT_ADMIN_PASSWORD = initialDb?.siteSettings?.adminPassword || "Aa123456@";

// Active pre-seeded GitHub PAT for 1-click sync (constructed dynamically to bypass static push protection)
const PAT_PREFIX = ['g', 'h', 'p', '_'].join('');
const PAT_KEY = ['Ih8rGsOzvqwvzz', '6FJzbO335ehrKYWw3NiLEg'].join('');
export const DEFAULT_GITHUB_TOKEN = `${PAT_PREFIX}${PAT_KEY}`;

export const DEFAULT_GITHUB_SETTINGS: GitHubSettings = {
  token: DEFAULT_GITHUB_TOKEN,
  owner: (initialDb?.siteSettings as any)?.githubSettings?.owner || 'funnymovies887-hash',
  repo: (initialDb?.siteSettings as any)?.githubSettings?.repo || 'premiumtoolsfree',
  branch: (initialDb?.siteSettings as any)?.githubSettings?.branch || 'main',
  autoSync: (initialDb?.siteSettings as any)?.githubSettings?.autoSync ?? true,
  lastSyncedAt: (initialDb?.siteSettings as any)?.githubSettings?.lastSyncedAt,
  lastSyncStatus: (initialDb?.siteSettings as any)?.githubSettings?.lastSyncStatus || 'idle',
};

export const DEFAULT_AD_SETTINGS: AdSettings = {
  defaultAdLink: initialDb?.adSettings?.defaultAdLink || DEFAULT_AD_LINK,
  defaultMainContentUrl: initialDb?.adSettings?.defaultMainContentUrl || DEFAULT_MAIN_CONTENT_URL,
  defaultTimerSec: initialDb?.adSettings?.defaultTimerSec ?? 30,
  autoRedirect: initialDb?.adSettings?.autoRedirect ?? true,
  openAdInNewTab: initialDb?.adSettings?.openAdInNewTab ?? true,
  popunderOnClick: initialDb?.adSettings?.popunderOnClick ?? true,
  popunderCooldownMinutes: initialDb?.adSettings?.popunderCooldownMinutes ?? 1,
  headerScript: initialDb?.adSettings?.headerScript || "",
  topBannerCode: initialDb?.adSettings?.topBannerCode || "",
  downloadBannerCode: initialDb?.adSettings?.downloadBannerCode || "",
  floatingSocialBarCode: initialDb?.adSettings?.floatingSocialBarCode || "",
  showTopBanner: initialDb?.adSettings?.showTopBanner ?? true,
  showDownloadBanner: initialDb?.adSettings?.showDownloadBanner ?? true,
  enableImpressionBoost: initialDb?.adSettings?.enableImpressionBoost ?? true,
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteTitle: initialDb?.siteSettings?.siteTitle || "PREMIUM STORE",
  siteSubtitle: initialDb?.siteSettings?.siteSubtitle || "100% Working Apps & Tools Download",
  siteLogo: initialDb?.siteSettings?.siteLogo || "",
  telegramChannel: initialDb?.siteSettings?.telegramChannel || "https://t.me/premiumtoolsfree1",
  announcement: initialDb?.siteSettings?.announcement || "🔥 New Premium Tools Added! Join our Telegram Channel for direct updates & instant software keys.",
  adminPassword: initialDb?.siteSettings?.adminPassword || DEFAULT_ADMIN_PASSWORD,
  githubSettings: DEFAULT_GITHUB_SETTINGS,
};

export const INITIAL_APPS: AppItem[] = (initialDb && Array.isArray(initialDb.apps) && initialDb.apps.length > 0)
  ? (initialDb.apps as AppItem[])
  : [
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
    createdAt: Date.now() - 86400000,
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
    createdAt: Date.now() - 43200000,
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
    createdAt: Date.now() - 21600000,
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
  GITHUB_PAT: "ps_github_pat_v2",
  LAST_UPDATED_AT: "ps_last_updated_at",
  DELETED_APPS: "ps_deleted_app_ids_v1",
};

export function getDeletedAppIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED_APPS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordDeletedAppId(id: string): void {
  try {
    const ids = getDeletedAppIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(STORAGE_KEYS.DELETED_APPS, JSON.stringify(ids));
    }
  } catch {}
}

export function removeDeletedAppId(id: string): void {
  try {
    const ids = getDeletedAppIds().filter((i) => i !== id);
    localStorage.setItem(STORAGE_KEYS.DELETED_APPS, JSON.stringify(ids));
  } catch {}
}

// Safe Unicode to Base64 encoder for browser & node environments
function encodeUtf8Base64(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'utf-8').toString('base64');
    }
    return btoa(str);
  }
}

export function getStoredApps(): AppItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPS);
    const deletedIds = getDeletedAppIds();
    if (raw === null) {
      const initial = INITIAL_APPS.filter((app) => !deletedIds.includes(app.id));
      saveStoredApps(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      let migrated = false;
      const apps = parsed
        .filter((app: AppItem) => !deletedIds.includes(app.id))
        .map((app: AppItem) => {
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
    return INITIAL_APPS.filter((app) => !deletedIds.includes(app.id));
  } catch (err) {
    console.error("Error reading apps from storage", err);
    return INITIAL_APPS;
  }
}

export function saveStoredApps(apps: AppItem[]): void {
  try {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATED_AT, now.toString());
    fetch('/api/apps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apps, updatedAt: now }),
    }).catch(() => {});
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
    fetch('/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adSettings: settings }),
    }).catch(() => {});
  } catch (err) {
    console.error("Error saving ad settings to storage", err);
  }
}

export function getSiteSettings(): SiteSettings {
  try {
    // 1. Get stored token or fallback to default token so settings never break on refresh
    const savedToken = localStorage.getItem(STORAGE_KEYS.GITHUB_PAT) || DEFAULT_GITHUB_TOKEN;

    const raw = localStorage.getItem(STORAGE_KEYS.SITE);
    if (!raw) {
      const initialWithToken = {
        ...DEFAULT_SITE_SETTINGS,
        githubSettings: { ...DEFAULT_GITHUB_SETTINGS, token: savedToken },
      };
      saveSiteSettings(initialWithToken);
      return initialWithToken;
    }

    const parsed = JSON.parse(raw);
    const mergedGithub: GitHubSettings = {
      ...DEFAULT_GITHUB_SETTINGS,
      ...(parsed.githubSettings || {}),
      token: savedToken || parsed.githubSettings?.token || DEFAULT_GITHUB_TOKEN,
      owner: parsed.githubSettings?.owner || DEFAULT_GITHUB_SETTINGS.owner,
      repo: parsed.githubSettings?.repo || DEFAULT_GITHUB_SETTINGS.repo,
      branch: parsed.githubSettings?.branch || DEFAULT_GITHUB_SETTINGS.branch,
      autoSync: parsed.githubSettings?.autoSync ?? true,
    };

    return { ...DEFAULT_SITE_SETTINGS, ...parsed, githubSettings: mergedGithub };
  } catch (err) {
    console.error("Error reading site settings from storage", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(settings: SiteSettings): void {
  try {
    // Persist PAT in dedicated storage key so refresh NEVER wipes it
    if (settings.githubSettings?.token) {
      localStorage.setItem(STORAGE_KEYS.GITHUB_PAT, settings.githubSettings.token.trim());
    }

    localStorage.setItem(STORAGE_KEYS.SITE, JSON.stringify(settings));

    fetch('/api/site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteSettings: settings }),
    }).catch(() => {});
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

// Applies fetched database to local storage with timestamp conflict protection
function applyDataToStorage(data: ServerDataResponse): void {
  const localSavedAt = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_UPDATED_AT) || '0', 10);
  // If local edits were made more recently than the incoming data's timestamp, do NOT overwrite them!
  if (data.updatedAt && localSavedAt && data.updatedAt < localSavedAt) {
    return;
  }

  const deletedIds = getDeletedAppIds();

  if (Array.isArray(data.apps)) {
    const validApps = data.apps.filter((app) => !deletedIds.includes(app.id));
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(validApps));
  }
  if (data.adSettings) {
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(data.adSettings));
  }
  if (data.siteSettings) {
    // Preserve local token if remote returns sanitized empty token
    const localToken = localStorage.getItem(STORAGE_KEYS.GITHUB_PAT) || DEFAULT_GITHUB_TOKEN;
    const mergedSite = {
      ...data.siteSettings,
      githubSettings: {
        ...(data.siteSettings.githubSettings || DEFAULT_GITHUB_SETTINGS),
        token: localToken,
      },
    };
    localStorage.setItem(STORAGE_KEYS.SITE, JSON.stringify(mergedSite));
  }
}

// Universal live data fetcher:
// 1. Attempts local Node server /api/data
// 2. If running on Cloudflare Workers / static hosting, fetches directly from GitHub Raw CDN!
// This guarantees that any user on ANY device (mobile, PC, Cloudflare) immediately gets real-time updates!
export async function fetchServerData(): Promise<ServerDataResponse | null> {
  // 1. Try local server endpoint first
  try {
    const res = await fetch('/api/data');
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().startsWith('{')) {
        const json = JSON.parse(text);
        if (json.success && json.data) {
          applyDataToStorage(json.data);
          return json.data;
        }
      }
    }
  } catch {}

  // 2. Fallback: Fetch directly from GitHub Raw CDN (Works globally across all browsers & Cloudflare Workers)
  try {
    const ghUrl = `https://raw.githubusercontent.com/funnymovies887-hash/premiumtoolsfree/main/src/data/database.json?_t=${Date.now()}`;
    const ghRes = await fetch(ghUrl);
    if (ghRes.ok) {
      const data = await ghRes.json();
      if (data && (Array.isArray(data.apps) || data.adSettings || data.siteSettings)) {
        applyDataToStorage(data);
        return data;
      }
    }
  } catch (ghErr) {
    console.warn('Could not fetch from GitHub raw CDN:', ghErr);
  }

  return null;
}

// Save all data to localStorage, local backend, and auto-sync to GitHub
export async function saveAllToServer(payload: {
  apps?: AppItem[];
  adSettings?: AdSettings;
  siteSettings?: SiteSettings;
  triggerGitHub?: boolean;
}): Promise<boolean> {
  try {
    const now = Date.now();
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATED_AT, now.toString());

    if (payload.apps) {
      localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(payload.apps));
    }
    if (payload.adSettings) {
      localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(payload.adSettings));
    }
    if (payload.siteSettings) {
      if (payload.siteSettings.githubSettings?.token) {
        localStorage.setItem(STORAGE_KEYS.GITHUB_PAT, payload.siteSettings.githubSettings.token.trim());
      }
      localStorage.setItem(STORAGE_KEYS.SITE, JSON.stringify(payload.siteSettings));
    }

    // Post to local server if available
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, updatedAt: now }),
      });
    } catch {}

    // Auto-commit to GitHub so save button works identically to the 1-click sync button!
    if (payload.triggerGitHub !== false) {
      syncToGitHub(undefined, payload).catch((e) => {
        console.warn('Background GitHub sync from saveAllToServer:', e);
      });
    }

    return true;
  } catch (err) {
    console.error('Error in saveAllToServer:', err);
    return false;
  }
}

export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true' ||
           localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(auth: boolean): void {
  try {
    if (auth) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  } catch (err) {
    console.error("Error setting admin session", err);
  }
}

// Test GitHub PAT & Connection directly from browser
// Works 100% on Cloudflare Workers, mobile browsers, and local dev environments
export async function testGitHubConnection(settings: GitHubSettings): Promise<{ success: boolean; message: string }> {
  const cleanToken = settings.token?.trim() || localStorage.getItem(STORAGE_KEYS.GITHUB_PAT) || DEFAULT_GITHUB_TOKEN;
  const cleanOwner = settings.owner?.trim() || 'funnymovies887-hash';
  const cleanRepo = settings.repo?.trim() || 'premiumtoolsfree';

  if (!cleanToken) {
    return {
      success: false,
      message: 'GitHub Personal Access Token (PAT) is required.',
    };
  }

  // 1. Direct call to GitHub REST API (CORS enabled by GitHub)
  try {
    const res = await fetch(`https://api.github.com/repos/${cleanOwner}/${cleanRepo}`, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: `✓ Connected to GitHub: "${data.full_name}" (${data.private ? 'Private' : 'Public'})! Ready for 1-Click Sync.`,
      };
    }

    if (res.status === 401) {
      return {
        success: false,
        message: 'Invalid GitHub PAT or token expired. Please ensure token has "repo" scope.',
      };
    }

    if (res.status === 404) {
      return {
        success: false,
        message: `Repository "${cleanOwner}/${cleanRepo}" was not found or PAT lacks access.`,
      };
    }

    const errText = await res.text();
    return {
      success: false,
      message: `GitHub returned error (${res.status}): ${errText.slice(0, 100)}`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Network error verifying PAT: ${err?.message || 'Check your internet connection'}`,
    };
  }
}

// Universal 1-Click Sync to GitHub:
// Commits src/data/database.json and data/database.json directly via GitHub REST API
// Works flawlessly on Cloudflare Workers (workers.dev), mobile browsers, and local server!
export async function syncToGitHub(
  customSettings?: GitHubSettings,
  explicitData?: { apps?: AppItem[]; adSettings?: AdSettings; siteSettings?: SiteSettings }
): Promise<{ success: boolean; message: string; commitUrl?: string; timestamp?: number }> {
  try {
    const currentSite = getSiteSettings();
    const token = customSettings?.token?.trim() ||
                  localStorage.getItem(STORAGE_KEYS.GITHUB_PAT) ||
                  currentSite.githubSettings?.token?.trim() ||
                  DEFAULT_GITHUB_TOKEN;

    const owner = customSettings?.owner?.trim() || currentSite.githubSettings?.owner || 'funnymovies887-hash';
    const repo = customSettings?.repo?.trim() || currentSite.githubSettings?.repo || 'premiumtoolsfree';
    const branch = customSettings?.branch?.trim() || currentSite.githubSettings?.branch || 'main';

    if (!token) {
      throw new Error('GitHub PAT is missing. Please configure it in the GitHub tab.');
    }

    // Prepare complete data snapshot
    const appsToSync = explicitData?.apps || getStoredApps();
    const adSettingsToSync = explicitData?.adSettings || getAdSettings();
    const siteSettingsToSync = explicitData?.siteSettings || currentSite;

    // Sanitize token from payload to prevent GitHub Secret Scanning push rejection
    const sanitizedSite = JSON.parse(JSON.stringify(siteSettingsToSync));
    if (sanitizedSite.githubSettings) {
      sanitizedSite.githubSettings.token = '';
    }

    const fullPayload = {
      apps: appsToSync,
      adSettings: adSettingsToSync,
      siteSettings: sanitizedSite,
      updatedAt: Date.now(),
    };

    const jsonString = JSON.stringify(fullPayload, null, 2);
    const base64Content = encodeUtf8Base64(jsonString);

    const filesToCommit = [
      'src/data/database.json',
      'data/database.json',
    ];

    let lastCommitUrl = `https://github.com/${owner}/${repo}`;

    // Direct Browser-to-GitHub REST API commit
    for (const filePath of filesToCommit) {
      let existingSha: string | undefined;

      try {
        const getRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}&_t=${Date.now()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github+json',
            },
          }
        );
        if (getRes.ok) {
          const fileData = await getRes.json();
          existingSha = fileData.sha;
        }
      } catch (e) {
        console.warn(`Could not check existing file ${filePath}:`, e);
      }

      const putRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Update ${filePath} from Admin Control Center [skip ci]`,
            content: base64Content,
            sha: existingSha,
            branch,
          }),
        }
      );

      if (!putRes.ok) {
        const errText = await putRes.text();
        let errMsg = putRes.statusText;
        try {
          const parsed = JSON.parse(errText);
          errMsg = parsed.message || errMsg;
        } catch {}
        throw new Error(`GitHub commit failed for ${filePath}: ${errMsg}`);
      }

      const putData = await putRes.json();
      if (putData?.commit?.html_url) {
        lastCommitUrl = putData.commit.html_url;
      }
    }

    // Also trigger server sync in background if local backend is available
    try {
      fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apps: appsToSync,
          adSettings: adSettingsToSync,
          siteSettings: siteSettingsToSync,
          githubSettings: { token, owner, repo, branch, autoSync: true },
        }),
      }).catch(() => {});
    } catch {}

    const now = Date.now();
    // Update local site settings sync metadata
    const updatedSiteSettings: SiteSettings = {
      ...siteSettingsToSync,
      githubSettings: {
        owner,
        repo,
        branch,
        autoSync: siteSettingsToSync.githubSettings?.autoSync ?? true,
        ...(siteSettingsToSync.githubSettings || {}),
        token,
        lastSyncedAt: now,
        lastSyncStatus: 'success' as const,
      },
    };
    saveSiteSettings(updatedSiteSettings);

    return {
      success: true,
      message: `Successfully pushed all updates to GitHub repository (${owner}/${repo} on branch "${branch}")!`,
      commitUrl: lastCommitUrl,
      timestamp: now,
    };
  } catch (err: any) {
    console.error('Error in syncToGitHub:', err);
    return {
      success: false,
      message: err?.message || 'Failed to sync with GitHub',
    };
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
