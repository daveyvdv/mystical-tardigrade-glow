import React from 'react';
import { ImageLuminanceData } from '../utils/imageAnalysis';
import { AlertCircle, Sun, Moon, Sparkles } from 'lucide-react';

interface LightingHistogramProps {
  data: ImageLuminanceData;
}

export const LightingHistogram: React.FC<LightingHistogramProps> = ({ data }) => {
  const { histogram, avgBrightness, contrast, overexposedPercent, underexposedPercent } = data;

  // Normalize histogram values for canvas/SVG display (max bin peak)
  const maxBin = Math.max(...histogram, 1);
  
  // Sample histogram into 32 bars for smooth display
  const barCount = 32;
  const binStep = Math.floor(256 / barCount);
  const bars: number[] = [];

  for (let i = 0; i < barCount; i++) {
    let sum = 0;
    for (let j = 0; j < binStep; j++) {
      sum += histogram[i * binStep + j] || 0;
    }
    bars.push(sum);
  }

  const maxBar = Math.max(...bars, 1);

  // Dynamic feedback status badge
  let lightBadge = { text: 'Balanced Light', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40' };
  if (avgBrightness < 60) {
    lightBadge = { text: 'Dark / Underexposed', color: 'text-blue-400 border-blue-500/30 bg-blue-950/40' };
  } else if (avgBrightness > 190) {
    lightBadge = { text: 'Bright / Overexposed', color: 'text-amber-400 border-amber-500/30 bg-amber-950/40' };
  } else if (overexposedPercent > 8) {
    lightBadge = { text: 'Clipping Highlights', color: 'text-red-400 border-red-500/30 bg-red-950/40' };
  }

  return (
    <div className="bg-slate-900/85 backdrop-blur-md rounded-xl p-3 border border-slate-700/60 shadow-xl text-white text-xs w-64 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Luminance Histogram</span>
        </div>
        <span className={`px-2 py-0.5 text-[10px] rounded-full border ${lightBadge.color}`}>
          {lightBadge.text}
        </span>
      </div>

      {/* Histogram Graph */}
      <div className="h-14 w-full bg-slate-950/80 rounded border border-slate-800 flex items-end p-1 gap-[2px]">
        {bars.map((val, idx) => {
          const heightPct = Math.max(4, Math.round((val / maxBar) * 100));
          // Gradient from shadows (blue/purple) -> midtones (green/amber) -> highlights (white/red)
          let barBg = 'bg-slate-500';
          if (idx < 8) barBg = 'bg-indigo-500';
          else if (idx < 24) barBg = 'bg-amber-400';
          else barBg = idx > 29 && overexposedPercent > 5 ? 'bg-red-500' : 'bg-slate-100';

          return (
            <div
              key={idx}
              className={`flex-1 rounded-t-sm transition-all duration-75 ${barBg}`}
              style={{ height: `${heightPct}%` }}
            />
          );
        })}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-300 text-center pt-1 border-t border-slate-800">
        <div className="bg-slate-800/50 p-1 rounded">
          <div className="text-slate-400">Brightness</div>
          <div className="font-mono font-medium">{avgBrightness}/255</div>
        </div>
        <div className="bg-slate-800/50 p-1 rounded">
          <div className="text-slate-400">Contrast</div>
          <div className="font-mono font-medium">{contrast}%</div>
        </div>
        <div className="bg-slate-800/50 p-1 rounded">
          <div className="text-slate-400">Highlights</div>
          <div className={`font-mono font-medium ${overexposedPercent > 8 ? 'text-red-400' : 'text-slate-200'}`}>
            {overexposedPercent}% clip
          </div>
        </div>
      </div>

      {/* Live Warning / Tips */}
      {overexposedPercent > 8 && (
        <div className="flex items-center gap-1.5 text-[10px] text-red-300 bg-red-950/60 p-1.5 rounded border border-red-800/40">
          <AlertCircle className="w-3 h-3 shrink-0 text-red-400" />
          <span>Lower exposure slider or angle camera away from direct glare.</span>
        </div>
      )}
      {underexposedPercent > 15 && avgBrightness < 60 && (
        <div className="flex items-center gap-1.5 text-[10px] text-blue-300 bg-blue-950/60 p-1.5 rounded border border-blue-800/40">
          <Moon className="w-3 h-3 shrink-0 text-blue-400" />
          <span>Low light detected. Keep camera steady to prevent blur.</span>
        </div>
      )}
    </div>
  );
};