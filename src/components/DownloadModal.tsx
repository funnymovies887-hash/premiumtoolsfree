import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  ArrowLeft, 
  Send, 
  Clock, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AppItem, AdSettings, SiteSettings } from '../types';
import { AdContainer } from './AdContainer';

interface DownloadModalProps {
  app: AppItem | null;
  adSettings: AdSettings;
  siteSettings: SiteSettings;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  app,
  adSettings,
  siteSettings,
  onClose,
}) => {
  if (!app) return null;

  const timerDuration = app.timerSeconds || adSettings.defaultTimerSec || 30;
  const activeAdLink = app.adLink || adSettings.defaultAdLink;
  const activeMainContentUrl = app.mainContentUrl || siteSettings.telegramChannel || adSettings.defaultMainContentUrl;

  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [hasAdBeenOpened, setHasAdBeenOpened] = useState<boolean>(false);
  const [redirectNotice, setRedirectNotice] = useState<string>('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-open ad link on initial load if configured, or when user clicks
  useEffect(() => {
    // Reset states on new app
    setTimeLeft(timerDuration);
    setIsRunning(true);
    setIsUnlocked(false);
    setRedirectNotice('');

    // If configured to open ad immediately
    if (adSettings.openAdInNewTab && !hasAdBeenOpened) {
      try {
        const adWindow = window.open(activeAdLink, '_blank');
        if (adWindow) {
          setHasAdBeenOpened(true);
        }
      } catch (e) {
        console.log("Popup blocked or not allowed automatically", e);
      }
    }
  }, [app.id]);

  // Countdown timer effect
  useEffect(() => {
    if (!isRunning || isUnlocked) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          handleUnlock();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isUnlocked]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    setIsRunning(false);

    if (adSettings.autoRedirect) {
      setRedirectNotice("Redirecting you to Telegram Channel / Download File in 2 seconds...");
      setTimeout(() => {
        // Open the telegram channel / main content
        window.open(activeMainContentUrl, '_blank');
      }, 1500);
    }
  };

  const handleManualAdClick = () => {
    window.open(activeAdLink, '_blank');
    setHasAdBeenOpened(true);
  };

  const progressPercent = Math.min(
    100,
    Math.round(((timerDuration - timeLeft) / timerDuration) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg my-auto rounded-3xl bg-gradient-to-b from-[#181926] to-[#10111a] border border-cyan-500/20 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(0,242,234,0.15)] text-center text-white animate-in fade-in zoom-in duration-200">
        
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Premium Unlocked Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wider uppercase mb-5 shadow-[0_0_15px_rgba(0,242,234,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>PREMIUM UNLOCK SERVER</span>
        </div>

        {/* 3D App Icon */}
        <div className="relative mx-auto mb-4 inline-block">
          <div className="relative overflow-hidden rounded-3xl border-2 border-cyan-400/40 shadow-[0_12px_24px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2)]">
            <img
              src={app.logo}
              alt={app.name}
              className="h-24 w-24 sm:h-28 sm:w-28 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-black shadow-lg border-2 border-[#181926]">
            <Check className="h-4 w-4 stroke-[3] text-black" />
          </div>
        </div>

        {/* App Title & Version */}
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          {app.name}
        </h2>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-4">
          <span className="bg-white/5 px-2.5 py-0.5 rounded-md border border-white/10">{app.version}</span>
          <span>•</span>
          <span className="bg-white/5 px-2.5 py-0.5 rounded-md border border-white/10">{app.fileSize}</span>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-300 font-medium mb-6 bg-white/[0.03] py-2 px-3 rounded-xl border border-white/5">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> 100% Virus Free
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1 text-amber-400">
            <Zap className="w-4 h-4" /> High-Speed Server
          </span>
        </div>

        {/* Ad Watch & Unlock Button */}
        {!isUnlocked && (
          <div className="mb-4">
            <button
              id="watch-ad-button"
              onClick={handleManualAdClick}
              className="btn-3d-pink w-full py-3.5 px-4 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Click Here To View Sponsor Offer / Ads</span>
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              Viewing the sponsor offer supports free servers and unlocks file directly.
            </p>
          </div>
        )}

        {/* 30 Seconds Progress Bar & Live Status */}
        <div className="my-5 bg-[#0e0f17] p-4 rounded-2xl border border-white/5 shadow-inner">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              {isUnlocked ? "Link Unlocked!" : `Unlocking File in ${timeLeft}s`}
            </span>
            <span className="text-slate-400">{progressPercent}%</span>
          </div>

          <div className="w-full h-3.5 rounded-full bg-[#1b1d2a] overflow-hidden p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isUnlocked
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                  : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 shadow-[0_0_12px_rgba(0,242,234,0.6)]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Status Message */}
          <div className="mt-2.5 text-xs text-slate-400">
            {!isUnlocked ? (
              <span className="text-cyan-300">
                Please wait {timeLeft} seconds while the high-speed download link is decrypted...
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <Check className="w-4 h-4" /> Link successfully unlocked!
              </span>
            )}
          </div>
        </div>

        {/* Redirect Notice if active */}
        {redirectNotice && (
          <div className="my-3 p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-center gap-2 animate-pulse">
            <Send className="w-4 h-4" />
            <span>{redirectNotice}</span>
          </div>
        )}

        {/* Download Button (Locked vs Unlocked) */}
        <div className="mt-4">
          {isUnlocked ? (
            <a
              id="unlocked-download-btn"
              href={activeMainContentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-3d-cyan w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 cursor-pointer animate-pulse-glow"
            >
              <Send className="w-5 h-5 text-black" />
              <span>DOWNLOAD NOW (MAIN TELEGRAM CHANNEL)</span>
            </a>
          ) : (
            <button
              disabled
              className="w-full py-3.5 px-6 rounded-2xl bg-white/5 border border-white/5 text-slate-500 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>Download Locked (Wait {timeLeft}s)</span>
            </button>
          )}
        </div>

        {/* Secondary Direct Link Fallback */}
        {isUnlocked && (
          <p className="text-[11px] text-slate-400 mt-3">
            If Telegram does not open automatically, click the button above to access the main file channel:{' '}
            <span className="text-cyan-400 underline">{siteSettings.telegramChannel}</span>
          </p>
        )}

        {/* Adsterra / Monetag Download Banner Container */}
        {adSettings.showDownloadBanner && (
          <div className="mt-6 pt-4 border-t border-white/5">
            <AdContainer
              type="downloadBanner"
              customCode={adSettings.downloadBannerCode}
              defaultAdLink={activeAdLink}
              title="Sponsor High-Speed Mirror"
            />
          </div>
        )}
      </div>
    </div>
  );
};
