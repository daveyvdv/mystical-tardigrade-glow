import React from 'react';
import { CameraManualSettings } from '../types/camera';
import { Focus, Eye, Ruler } from 'lucide-react';

interface DofCalculatorWidgetProps {
  settings: CameraManualSettings;
}

export const DofCalculatorWidget: React.FC<DofCalculatorWidgetProps> = ({ settings }) => {
  const { aperture, focalLength, subjectDistance } = settings;

  // Standard full-frame circle of confusion (0.029 mm)
  const coc = 0.029; 
  const f = focalLength; // in mm
  const N = aperture;

  // Hyperfocal distance in meters: H = (f^2 / (N * CoC)) / 1000
  const hyperfocalMeters = (f * f) / (N * coc * 1000);

  // Near limit: D_near = (s * H) / (H + (s - f/1000))
  const s = subjectDistance; // in meters
  const nearLimitMeters = (s * hyperfocalMeters) / (hyperfocalMeters + (s - f / 1000));

  // Far limit: D_far = (s * H) / (H - (s - f/1000))
  const denominatorFar = hyperfocalMeters - (s - f / 1000);
  const farLimitMeters = denominatorFar > 0 ? (s * hyperfocalMeters) / denominatorFar : Infinity;

  // Total Depth of Field in meters
  const totalDofMeters = farLimitMeters === Infinity ? Infinity : farLimitMeters - nearLimitMeters;

  // Subject separation quality rating
  let dofRating = 'Medium Depth';
  let dofColor = 'text-amber-400 border-amber-500/30 bg-amber-950/40';

  if (totalDofMeters < 0.3) {
    dofRating = 'Ultra Shallow (Creamy Bokeh)';
    dofColor = 'text-purple-400 border-purple-500/30 bg-purple-950/40';
  } else if (totalDofMeters < 1.2) {
    dofRating = 'Shallow Subject Isolation';
    dofColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
  } else if (farLimitMeters === Infinity || totalDofMeters > 5) {
    dofRating = 'Deep Field Focus (Sharp Horizon)';
    dofColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40';
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 space-y-2.5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-200">
          <Focus className="w-3.5 h-3.5 text-purple-400" />
          <span>Real-time Depth of Field (DOF) Optical Engine</span>
        </div>
        <span className={`px-2 py-0.5 text-[10px] rounded-full border ${dofColor}`}>
          {dofRating}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
        <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
          <span className="text-slate-400 block text-[9px] flex items-center justify-center gap-1">
            <Ruler className="w-2.5 h-2.5 text-purple-400" /> Near Focus Limit
          </span>
          <span className="font-mono font-bold text-purple-300">{nearLimitMeters.toFixed(2)} m</span>
        </div>

        <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
          <span className="text-slate-400 block text-[9px]">Subject Distance</span>
          <span className="font-mono font-bold text-amber-300">{s.toFixed(1)} m</span>
        </div>

        <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
          <span className="text-slate-400 block text-[9px]">Far Focus Limit</span>
          <span className="font-mono font-bold text-cyan-300">
            {farLimitMeters === Infinity ? '∞ Infinity' : `${farLimitMeters.toFixed(2)} m`}
          </span>
        </div>
      </div>

      {/* Hyperfocal Info Note */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-900/40 px-2 py-1 rounded">
        <span>Hyperfocal Sharpness Distance:</span>
        <span className="font-mono font-semibold text-emerald-400">{hyperfocalMeters.toFixed(2)} meters</span>
      </div>
    </div>
  );
};
</DofCalculatorWidget>

<dyad-write path="src/components/ManualControls.tsx" description="Adding Focal Length selector, Subject Distance slider, and DofCalculatorWidget to ManualControls.">
import React from 'react';
import { CameraManualSettings, FilmPresetType, AspectRatioType, LightDirectionType } from '../types/camera';
import { FilmPresetSelector } from './FilmPresetSelector';
import { DofCalculatorWidget } from './DofCalculatorWidget';
import { Sliders, Sun, Eye, Gauge, Flame, ZoomIn, Ruler } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ManualControlsProps {
  settings: CameraManualSettings;
  onChangeSettings: (newSettings: CameraManualSettings) => void;
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

export const ManualControls: React.FC<ManualControlsProps> = ({ settings, onChangeSettings }) => {
  return (
    <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 sm:p-4 text-xs text-slate-200 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 font-bold text-slate-100">
          <Sliders className="w-4 h-4 text-emerald-400" />
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
            })
          }
          className="text-[11px] text-amber-400 hover:underline"
        >
          Reset Defaults
        </button>
      </div>

      {/* Lens Focal Length Selection */}
      <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
            <span>Prime Lens Focal Length Field-of-View</span>
          </div>
          <span className="font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
            {settings.focalLength}mm
          </span>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px] justify-between overflow-x-auto gap-1">
          {FOCAL_LENGTH_PRESETS.map((preset) => (
            <button
              key={preset.mm}
              onClick={() => onChangeSettings({ ...settings, focalLength: preset.mm })}
              className={`px-2 py-1 rounded transition-all whitespace-nowrap font-mono ${
                settings.focalLength === preset.mm
                  ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {preset.mm}mm
            </button>
          ))}
        </div>

        <p className="text-[10px] text-slate-400 italic">
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

      {/* Optical Depth of Field Calculator */}
      <DofCalculatorWidget settings={settings} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
        {/* 1. Depth of Field / Aperture */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300 flex items-center gap-1 font-medium">
              <Eye className="w-3.5 h-3.5 text-purple-400" /> Aperture (Bokeh Blur)
            </span>
            <span className="font-mono text-purple-300 font-bold">f/{settings.aperture.toFixed(1)}</span>
          </div>
          <Slider
            value={[settings.aperture]}
            min={1.4}
            max={16}
            step={0.2}
            onValueChange={([val]) => onChangeSettings({ ...settings, aperture: val })}
            className="cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">
            {settings.aperture <= 2.8 ? 'Soft background blur (Great for Portraits)' : 'Sharp deep focus (Great for Landscapes)'}
          </p>
        </div>

        {/* 2. Subject Distance */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300 flex items-center gap-1 font-medium">
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
            <span className="text-slate-300 flex items-center gap-1 font-medium">
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
            <span className="text-slate-300 flex items-center gap-1 font-medium">
              <Sun className="w-3.5 h-3.5 text-emerald-400" /> Exposure EV
            </span>
            <span className="font-mono text-emerald-300 font-bold">
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
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300 flex items-center gap-1 font-medium">
              <Gauge className="w-3.5 h-3.5 text-blue-400" /> ISO Sensitivity
            </span>
            <span className="font-mono text-blue-300 font-bold">ISO {settings.iso}</span>
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