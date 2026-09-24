import React from 'react';
import { Check, Download, Star } from 'lucide-react';
import { AppItem } from '../types';

interface AppCardProps {
  app: AppItem;
  onSelectApp: (app: AppItem) => void;
  defaultAdLink: string;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  onSelectApp,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelectApp(app);
  };

  return (
    <div
      id={`app-card-${app.id}`}
      onClick={handleClick}
      className="card-3d group relative flex flex-col items-center justify-between rounded-2xl p-4 text-center cursor-pointer select-none transition-all duration-300"
    >
      {/* Featured Ribbon if applicable */}
      {app.isFeatured && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md shadow-pink-500/30">
          HOT
        </div>
      )}

      {/* 3D App Icon Wrapper */}
      <div className="relative mb-3 mt-1 inline-block">
        <div className="relative overflow-hidden rounded-2xl border-2 border-cyan-400/30 shadow-[0_8px_18px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2)] transition-transform duration-300 group-hover:scale-105 group-hover:border-cyan-400/70">
          <img
            src={app.logo}
            alt={app.name}
            onError={(e) => {
              // Fallback placeholder image
              (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80`;
            }}
            className="h-18 w-18 sm:h-20 sm:w-20 object-cover"
            loading="lazy"
          />
        </div>

        {/* Verified Badge */}
        <div 
          title="Verified Working"
          className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-black shadow-md shadow-black/80 border-2 border-[#121218]"
        >
          <Check className="h-3.5 w-3.5 stroke-[3] text-black" />
        </div>
      </div>

      {/* App Information */}
      <div className="w-full flex-1 flex flex-col justify-start">
        <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1">
          {app.name}
        </h3>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 mb-2">
          <span>{app.fileSize || 'Free'}</span>
          <span>•</span>
          <span className="flex items-center text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 inline mr-0.5" />
            {app.rating || '4.9'}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {app.description}
        </p>
      </div>

      {/* 3D "GET APP" Button */}
      <div className="w-full pt-1">
        <button
          type="button"
          className="btn-3d-cyan w-full py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>GET APP</span>
        </button>
      </div>
    </div>
  );
};
