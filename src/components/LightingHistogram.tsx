import React from 'react';
import { ImageLuminanceData } from '../utils/imageAnalysis';
import { AlertCircle, Sun, Moon } from 'lucide-react';

interface LightingHistogramProps {
  data: ImageLuminanceData;
}

export const LightingHistogram: React.FC<LightingHistogramProps> = ({ data }) => {
  const { histogram, avgBrightness, contrast, overexposedPercent, underexposedPercent } = data;

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

  let lightBadge = { text: 'Balanced Light', color: 'text-amber-300 border-amber-500/30 bg-amber-950/40' };
  if (avgBrightness < 60) {
    lightBadge = { text: 'Dark / Underexposed', color: 'text-zinc-300 border-zinc-500/30 bg-zinc-900/60' };
  } else if (avgBrightness > 190) {
    lightBadge = { text: 'Bright / Overexposed', color: 'text-yellow-300 border-yellow-500/30 bg-yellow-950/40' };
  } else if (overexposedPercent > 8) {
    lightBadge = { text: 'Clipping Highlights', color: 'text-amber-400 border-amber-500/40 bg-amber-950/60' };
  }

  return (
    <div className="bg-zinc-950/90 backdrop-blur-md rounded-xl p-3 border border-amber-500/30 shadow-xl text-white text-xs w-64 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-200">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Luminance Histogram</span>
        </div>
        <span className={`px-2 py-0.5 text-[10px] rounded-full border ${lightBadge.color}`}>
          {lightBadge.text}
        </span>
      </div>

      {/* Histogram Graph */}
      <div className="h-14 w-full bg-zinc-900/90 rounded border border-zinc-800 flex items-end p-1 gap-[2px]">
        {bars.map((val, idx) => {
          const heightPct = Math.max(4, Math.round((val / maxBar) * 100));
          let barBg = 'bg-zinc-500';
          if (idx < 8) barBg = 'bg-amber-800';
          else if (idx < 24) barBg = 'bg-amber-400';
          else barBg = idx > 29 && overexposedPercent > 5 ? 'bg-amber-200' : 'bg-white';

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
      <div className="grid grid-cols-3 gap-1 text-[10px] text-zinc-300 text-center pt-1 border-t border-zinc-800">
        <div className="bg-zinc-900 p-1 rounded">
          <div className="text-zinc-400">Brightness</div>
          <div className="font-mono font-medium text-white">{avgBrightness}/255</div>
        </div>
        <div className="bg-zinc-900 p-1 rounded">
          <div className="text-zinc-400">Contrast</div>
          <div className="font-mono font-medium text-white">{contrast}%</div>
        </div>
        <div className="bg-zinc-900 p-1 rounded">
          <div className="text-zinc-400">Highlights</div>
          <div className={`font-mono font-medium ${overexposedPercent > 8 ? 'text-amber-400' : 'text-zinc-200'}`}>
            {overexposedPercent}% clip
          </div>
        </div>
      </div>

      {/* Live Warning / Tips */}
      {overexposedPercent > 8 && (
        <div className="flex items-center gap-1.5 text-[10px] text-amber-200 bg-amber-950/60 p-1.5 rounded border border-amber-800/40">
          <AlertCircle className="w-3 h-3 shrink-0 text-amber-400" />
          <span>Lower exposure slider or angle camera away from direct glare.</span>
        </div>
      )}
      {underexposedPercent > 15 && avgBrightness < 60 && (
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-300 bg-zinc-900/80 p-1.5 rounded border border-zinc-700/40">
          <Moon className="w-3 h-3 shrink-0 text-amber-300" />
          <span>Low light detected. Keep camera steady to prevent blur.</span>
        </div>
      )}
    </div>
  );
};