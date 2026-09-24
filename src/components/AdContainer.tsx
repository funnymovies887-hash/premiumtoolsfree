import React, { useEffect, useRef } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdContainerProps {
  type: 'topBanner' | 'downloadBanner' | 'floating';
  customCode?: string;
  defaultAdLink: string;
  title?: string;
}

export const AdContainer: React.FC<AdContainerProps> = ({
  type,
  customCode,
  defaultAdLink,
  title,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (customCode && customCode.trim().length > 0) {
      containerRef.current.innerHTML = '';
      
      // Parse and execute scripts safely
      const wrapper = document.createElement('div');
      wrapper.innerHTML = customCode;

      const scripts = wrapper.querySelectorAll('script');
      const nonScripts = wrapper.querySelectorAll(':not(script)');

      // Append HTML non-script elements
      nonScripts.forEach((node) => {
        if (node.parentElement === wrapper) {
          containerRef.current?.appendChild(node.cloneNode(true));
        }
      });

      // If wrapper itself has text/elements
      if (nonScripts.length === 0 && scripts.length === 0) {
        containerRef.current.innerHTML = customCode;
      }

      // Re-create scripts so the browser executes them
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.innerHTML = oldScript.innerHTML;
        containerRef.current?.appendChild(newScript);
      });
    }
  }, [customCode]);

  // If user provided custom script / banner code, render the container
  if (customCode && customCode.trim().length > 0) {
    return (
      <div 
        id={`ad-slot-${type}`}
        className="w-full my-4 flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
          <span>Sponsored Advertisement</span>
        </div>
        <div 
          ref={containerRef} 
          className="w-full max-w-4xl flex justify-center items-center min-h-[90px] bg-[#12131c]/60 rounded-xl border border-white/5 p-2"
        />
      </div>
    );
  }

  // Fallback high-converting sponsor card targeting user's Ad link
  if (type === 'topBanner') {
    return (
      <div 
        id="ad-slot-top-banner"
        className="w-full max-w-5xl mx-auto my-4 px-4"
      >
        <a
          href={defaultAdLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-[#141624] via-[#10121d] to-[#141624] p-3.5 sm:p-4 transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_25px_rgba(0,242,234,0.15)]"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-black shadow-lg shadow-cyan-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                    Sponsor Offer
                  </span>
                  <span className="text-xs text-slate-400">High-Speed VIP Cloud Server</span>
                </div>
                <h4 className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {title || "Unlock Fast Direct Downloads & Uncapped Premium Bandwidth"}
                </h4>
              </div>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-bold text-black shadow-md shadow-cyan-400/20 group-hover:scale-105 transition-transform">
                Claim VIP Access <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </a>
      </div>
    );
  }

  if (type === 'downloadBanner') {
    return (
      <div id="ad-slot-download-banner" className="w-full my-4">
        <a
          href={defaultAdLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl border border-pink-500/20 bg-gradient-to-br from-[#18121f] to-[#12131c] p-4 text-center transition-all hover:border-pink-500/40 hover:shadow-[0_0_20px_rgba(255,0,85,0.2)]"
        >
          <span className="inline-block text-[10px] uppercase font-bold tracking-widest text-pink-400 mb-1">
            SPONSOR VERIFICATION
          </span>
          <p className="text-xs text-slate-300">
            Click here to verify high-speed link and bypass standard wait time.
          </p>
          <div className="mt-2 text-xs font-semibold text-cyan-400 group-hover:underline flex items-center justify-center gap-1">
            <span>Verify & Direct Download</span>
            <ExternalLink className="w-3 h-3" />
          </div>
        </a>
      </div>
    );
  }

  return null;
};
