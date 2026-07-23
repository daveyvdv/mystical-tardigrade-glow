import React from 'react';
import { FilmPresetType, LightDirectionType, AspectRatioType } from '../types/camera';
import { Film, Sun, Crop, Palette } from 'lucide-react';

interface FilmPresetSelectorProps {
  filmPreset: FilmPresetType;
  onSelectPreset: (preset: FilmPresetType) => void;
  aspectRatio: AspectRatioType;
  onSelectAspectRatio: (ratio: AspectRatioType) => void;
  lightDirection: LightDirectionType;
  onSelectLightDirection: (dir: LightDirectionType) => void;
}

export const FilmPresetSelector: React.FC<FilmPresetSelectorProps> = ({
  filmPreset,
  onSelectPreset,
  aspectRatio,
  onSelectAspectRatio,
  lightDirection,
  onSelectLightDirection,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 space-y-3">
      {/* 1. Film Look Presets */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>Film Profile Emulation</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          <button
            onClick={() => onSelectPreset('standard')}
            className={`px-2 py-1.5 rounded border text-[11px] font-medium transition-all ${
              filmPreset === 'standard' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Natural
          </button>
          <button
            onClick={() => onSelectPreset('monochrome')}
            className={`px-2 py-1.5 rounded border text-[11px] font-medium transition-all ${
              filmPreset === 'monochrome' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            B&W Noir
          </button>
          <button
            onClick={() => onSelectPreset('kodachrome')}
            className={`px-2 py-1.5 rounded border text-[11px] font-medium transition-all ${
              filmPreset === 'kodachrome' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Kodachrome
          </button>
          <button
            onClick={() => onSelectPreset('teal_orange')}
            className={`px-2 py-1.5 rounded border text-[11px] font-medium transition-all ${
              filmPreset === 'teal_orange' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Teal & Orange
          </button>
          <button
            onClick={() => onSelectPreset('pastel_portrait')}
            className={`px-2 py-1.5 rounded border text-[11px] font-medium transition-all ${
              filmPreset === 'pastel_portrait' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Pastel Glow
          </button>
          <button
            onClick={() => onSelectPreset('fuji_vivid')}
            className={`px-2 py-1.5 rounded border text-[11px] font-medium transition-all ${
              filmPreset === 'fuji_vivid' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Fuji Vivid
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
        {/* 2. Aspect Ratio Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Crop className="w-3.5 h-3.5 text-purple-400" />
            <span>Frame Aspect Ratio</span>
          </div>
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs justify-between">
            {(['3:2', '4:5', '1:1', '16:9', '2.39:1'] as AspectRatioType[]).map((ratio) => (
              <button
                key={ratio}
                onClick={() => onSelectAspectRatio(ratio)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${
                  aspectRatio === ratio ? 'bg-purple-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Light Direction Simulator */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Light Angle Simulation</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            <button
              onClick={() => onSelectLightDirection('golden_hour')}
              className={`px-2 py-1 rounded border transition-colors ${
                lightDirection === 'golden_hour' ? 'bg-amber-600 border-amber-400 text-white font-semibold' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              🌅 Golden Sunset
            </button>
            <button
              onClick={() => onSelectLightDirection('soft_side')}
              className={`px-2 py-1 rounded border transition-colors ${
                lightDirection === 'soft_side' ? 'bg-amber-600 border-amber-400 text-white font-semibold' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              🪟 Soft Window Light
            </button>
            <button
              onClick={() => onSelectLightDirection('midday_harsh')}
              className={`px-2 py-1 rounded border transition-colors ${
                lightDirection === 'midday_harsh' ? 'bg-amber-600 border-amber-400 text-white font-semibold' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              ☀️ Midday Sun (Harsh)
            </button>
            <button
              onClick={() => onSelectLightDirection('backlit')}
              className={`px-2 py-1 rounded border transition-colors ${
                lightDirection === 'backlit' ? 'bg-amber-600 border-amber-400 text-white font-semibold' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              ✨ Backlit Rim Light
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};