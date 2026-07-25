import React from 'react';
import { CameraManualSettings, CameraRecipe } from '../types/camera';
import { FilmPresetSelector } from './FilmPresetSelector';
import { DofCalculatorWidget } from './DofCalculatorWidget';
import { CameraRecipesBar } from './CameraRecipesBar';
import { Sliders, Sun, Eye, Gauge, Flame, ZoomIn, Ruler, Crosshair } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ManualControlsProps {
  settings: CameraManualSettings;
  onChangeSettings: (newSettings: CameraManualSettings) => void;
  onApplyRecipe?: (recipe: CameraRecipe) => void;
}

const FOCAL_LENGTH_PRESETS = [
  { mm: 16, label: '16mm Ultra-Wide', tip: 'Extreme landscape & architecture' },
  { mm: 24, label: '24mm Wide Angle', tip: 'Environmental street portraits' },
  { mm: 35, label: '35mm Street Lens', tip: 'Classic documentary & story' },
  { mm: 50, label: '50mm Nifty Fifty', tip: 'Natural human vision perspective' },
  { mm: 85, label: '85mm Portrait Pro', tip: 'Flattering compression & bokeh' },
  { mm: 135, label: '135mm Telephoto', tip: 'Tight face framing & subject isolation' },
  { mm: 200, label: '200mm Super Tele', tip: 'Wildlife & far distance compression' },
];

export const ManualControls: React.FC<ManualControlsProps> = ({ settings, onChangeSettings, onApplyRecipe }) => {
  return (
    <div className="bg-zinc-950 border border-amber-500/30 rounded-xl p-3 sm:p-4 text-xs text-white space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2 font-bold text-white">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>Pro Manual Tuning, Lens Simulation & Film Styles</span>
        </div>
        <button
          onClick={() =>
            onChangeSettings({
              aperture: 2.8,
              whiteBalance: 5500,
              exposureEv: 0,
              iso: 200,
              filmPreset: 'standard',
              aspectRatio: '3:2',
              lightDirection: 'golden_hour',
              focalLength: 50,
              subjectDistance: 2.5,
              meteringMode: 'matrix'
            })
          }
          className="text-[11px] text-amber-400 hover:underline font-medium"
        >
          Reset Defaults
        </button>
      </div>

      {/* Instant 1-Click Pro Camera Recipes */}
      {onApplyRecipe && (
        <CameraRecipesBar currentSettings={settings} onApplyRecipe={onApplyRecipe} />
      )}

      {/* Lens Focal Length Selection */}
      <div className="space-y-2 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-white">
            <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
            <span>Prime Lens Focal Length Field-of-View</span>
          </div>
          <span className="font-mono text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40">
            {settings.focalLength}mm
          </span>
        </div>

        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-[11px] justify-between overflow-x-auto gap-1">
          {FOCAL_LENGTH_PRESETS.map((preset) => (
            <button
              key={preset.mm}
              onClick={() => onChangeSettings({ ...settings, focalLength: preset.mm })}
              className={`px-2 py-1 rounded transition-all whitespace-nowrap font-mono ${
                settings.focalLength === preset.mm
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {preset.mm}mm
            </button>
          ))}
        </div>

        <p className="text-[10px] text-zinc-400 italic">
          💡 {FOCAL_LENGTH_PRESETS.find((f) => f.mm === settings.focalLength)?.tip}
        </p>
      </div>

      {/* Film Profile & Aspect Ratio Controls */}
      <FilmPresetSelector
        filmPreset={settings.filmPreset}
        onSelectPreset={(filmPreset) => onChangeSettings({ ...settings, filmPreset })}
        aspectRatio={settings.aspectRatio}
        onSelectAspectRatio={(aspectRatio) => onChangeSettings({ ...settings, aspectRatio })}
        lightDirection={settings.lightDirection}
        onSelectLightDirection={(lightDirection) => onChangeSettings({ ...settings, lightDirection })}
      />

      {/* Exposure Metering Mode */}
      <div className="space-y-1.5 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-1.5 font-semibold text-white">
          <Crosshair className="w-3.5 h-3.5 text-amber-400" />
          <span>Exposure Light Metering Mode</span>
        </div>
        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-[11px] justify-between gap-1">
          <button
            onClick={() => onChangeSettings({ ...settings, meteringMode: 'matrix' })}
            className={`flex-1 py-1 rounded transition-colors ${
              settings.meteringMode === 'matrix' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Matrix / Evaluative
          </button>
          <button
            onClick={() => onChangeSettings({ ...settings, meteringMode: 'center_weighted' })}
            className={`flex-1 py-1 rounded transition-colors ${
              settings.meteringMode === 'center_weighted' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Center-Weighted
          </button>
          <button
            onClick={() => onChangeSettings({ ...settings, meteringMode: 'spot' })}
            className={`flex-1 py-1 rounded transition-colors ${
              settings.meteringMode === 'spot' ? 'bg-amber-500 text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Spot Metering
          </button>
        </div>
      </div>

      {/* Optical Depth of Field Calculator */}
      <DofCalculatorWidget settings={settings} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
        {/* 1. Depth of Field / Aperture */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-300 flex items-center gap-1 font-medium">
              <Eye className="w-3.5 h-3.5 text-amber-400" /> Aperture (Bokeh Blur)
            </span>
            <span className="font-mono text-amber-300 font-bold">f/{settings.aperture.toFixed(1)}</span>
          </div>
          <Slider
            value={[settings.aperture]}
            min={1.4}
            max={16}
            step={0.2}
            onValueChange={([val]) => onChangeSettings({ ...settings, aperture: val })}
            className="cursor-pointer"
          />
        </div>

        {/* 2. Subject Distance */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-300 flex items-center gap-1 font-medium">
              <Ruler className="w-3.5 h-3.5 text-amber-400" /> Subject Distance
            </span>
            <span className="font-mono text-amber-300 font-bold">{settings.subjectDistance.toFixed(1)} m</span>
          </div>
          <Slider
            value={[settings.subjectDistance]}
            min={0.5}
            max={15}
            step={0.5}
            onValueChange={([val]) => onChangeSettings({ ...settings, subjectDistance: val })}
            className="cursor-pointer"
          />
        </div>

        {/* 3. White Balance Temperature */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-300 flex items-center gap-1 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Color Temp (WB)
            </span>
            <span className="font-mono text-amber-300 font-bold">{settings.whiteBalance}K</span>
          </div>
          <Slider
            value={[settings.whiteBalance]}
            min={2700}
            max={8000}
            step={100}
            onValueChange={([val]) => onChangeSettings({ ...settings, whiteBalance: val })}
            className="cursor-pointer"
          />
        </div>

        {/* 4. Exposure Compensation EV */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-300 flex items-center gap-1 font-medium">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Exposure EV
            </span>
            <span className="font-mono text-amber-300 font-bold">
              {settings.exposureEv > 0 ? `+${settings.exposureEv.toFixed(1)}` : settings.exposureEv.toFixed(1)} EV
            </span>
          </div>
          <Slider
            value={[settings.exposureEv]}
            min={-2}
            max={2}
            step={0.1}
            onValueChange={([val]) => onChangeSettings({ ...settings, exposureEv: val })}
            className="cursor-pointer"
          />
        </div>

        {/* 5. ISO Speed */}
        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-300 flex items-center gap-1 font-medium">
              <Gauge className="w-3.5 h-3.5 text-amber-400" /> ISO Sensitivity
            </span>
            <span className="font-mono text-amber-300 font-bold">ISO {settings.iso}</span>
          </div>
          <Slider
            value={[settings.iso]}
            min={100}
            max={3200}
            step={100}
            onValueChange={([val]) => onChangeSettings({ ...settings, iso: val })}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};