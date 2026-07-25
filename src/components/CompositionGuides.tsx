import React from 'react';
import { CompositionGuideType } from '../types/camera';

interface CompositionGuidesProps {
  guide: CompositionGuideType;
  tiltAngle: number;
}

export const CompositionGuides: React.FC<CompositionGuidesProps> = ({ guide, tiltAngle }) => {
  if (guide === 'none') return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* 1. Rule of Thirds */}
      {guide === 'thirds' && (
        <div className="w-full h-full relative">
          {/* Grid lines */}
          <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-white/40 border-t border-dashed border-white/80" />
          <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-white/40 border-t border-dashed border-white/80" />
          <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-white/40 border-l border-dashed border-white/80" />
          <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-white/40 border-l border-dashed border-white/80" />

          {/* Golden Power Points */}
          <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-amber-400 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div className="absolute top-1/3 left-2/3 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-amber-400 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div className="absolute top-2/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-amber-400 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div className="absolute top-2/3 left-2/3 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 border-amber-400 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>

          <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2 py-1 rounded text-[11px] text-amber-300 font-medium border border-amber-500/40">
            Target: Align points of interest with circle intersections
          </div>
        </div>
      )}

      {/* 2. Golden Ratio / Spiral */}
      {guide === 'golden_spiral' && (
        <svg className="w-full h-full stroke-amber-300/80 fill-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Fibonacci boxes overlay */}
          <rect x="0" y="0" width="61.8" height="100" strokeWidth="0.4" strokeDasharray="1,1" />
          <rect x="61.8" y="0" width="38.2" height="61.8" strokeWidth="0.4" strokeDasharray="1,1" />
          <rect x="61.8" y="61.8" width="23.6" height="38.2" strokeWidth="0.4" strokeDasharray="1,1" />
          
          {/* Golden Spiral Path */}
          <path
            d="M 0,100 A 61.8,61.8 0 0,1 61.8,0 A 38.2,38.2 0 0,1 100,61.8 A 23.6,23.6 0 0,1 76.4,100 A 14.6,14.6 0 0,1 61.8,85.4 A 9,9 0 0,1 70.8,76.4"
            strokeWidth="0.8"
            className="stroke-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
          />
          <circle cx="70.8" cy="76.4" r="2" className="fill-white stroke-none animate-ping" />
        </svg>
      )}

      {/* 3. Leading Lines / Perspective */}
      {guide === 'leading_lines' && (
        <svg className="w-full h-full stroke-amber-200/80 fill-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Diagonals leading to center focal area */}
          <line x1="0" y1="100" x2="50" y2="40" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="100" y1="100" x2="50" y2="40" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="0" y1="0" x2="50" y2="40" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="100" y1="0" x2="50" y2="40" strokeWidth="0.5" strokeDasharray="2,2" />

          {/* Focal Target */}
          <circle cx="50" cy="40" r="4" strokeWidth="0.8" className="stroke-amber-300 animate-pulse" />
          <line x1="45" y1="40" x2="55" y2="40" strokeWidth="0.5" />
          <line x1="50" y1="35" x2="50" y2="45" strokeWidth="0.5" />
        </svg>
      )}

      {/* 4. Center Symmetry */}
      {guide === 'center' && (
        <div className="w-full h-full relative flex items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-amber-400/60" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-amber-400/60" />
          
          <div className="w-24 h-24 border border-amber-400/50 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-amber-300 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* 5. Sub-Framing */}
      {guide === 'framing' && (
        <div className="w-full h-full relative p-8 md:p-14">
          <div className="w-full h-full border-2 border-amber-400/80 rounded-2xl border-dashed flex flex-col justify-between p-4">
            <div className="flex justify-between text-xs text-amber-200 font-mono">
              <span>┌ FRAME TOP</span>
              <span>RIGHT ┐</span>
            </div>
            <div className="text-center text-xs text-white bg-zinc-950/70 py-1 px-3 rounded-full self-center border border-amber-500/30">
              Place subject inside inner natural frame
            </div>
            <div className="flex justify-between text-xs text-amber-200 font-mono">
              <span>└ BOTTOM</span>
              <span>LEFT ┘</span>
            </div>
          </div>
        </div>
      )}

      {/* Tilt Horizon Indicator (Visible on all guides) */}
      <div 
        className="absolute inset-x-12 top-1/2 h-[2px] transition-transform duration-100 ease-out flex items-center justify-between"
        style={{ transform: `translateY(-50%) rotate(${tiltAngle}deg)` }}
      >
        <div className={`h-3 w-8 rounded-l border-y-2 border-l-2 ${Math.abs(tiltAngle) < 2 ? 'border-amber-400 bg-amber-500/20' : 'border-amber-600 bg-amber-700/20'}`} />
        <div className={`flex-1 h-[2px] mx-2 ${Math.abs(tiltAngle) < 2 ? 'bg-amber-300 shadow-[0_0_8px_#f59e0b]' : 'bg-amber-600'}`} />
        <div className={`h-3 w-8 rounded-r border-y-2 border-r-2 ${Math.abs(tiltAngle) < 2 ? 'border-amber-400 bg-amber-500/20' : 'border-amber-600 bg-amber-700/20'}`} />
      </div>
    </div>
  );
};