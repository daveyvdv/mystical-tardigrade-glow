import React from 'react';
import { CameraManualSettings } from '../types/camera';
import { Sliders, Sun, Eye, Gauge, Flame } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ManualControlsProps {
  settings: CameraManualSettings;
  onChangeSettings: (newSettings: CameraManualSettings) => void;
}

export const ManualControls: React.FC<ManualControlsProps> = ({ settings, onChangeSettings }) => {
  return (
    <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 sm:p-4 text-xs text-slate-200 space-y-3.5 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 font-bold text-slate-100">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>Pro Manual Camera Tuning</span>
        </div>
        <button
          onClick={() =>
            onChangeSettings({
              aperture: 2.8,
              whiteBalance: 5500,
              exposureEv: 0,
              iso: 200,
            })
          }
          className="text-[11px] text-amber-400 hover:underline"
        >
          Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* 2. White Balance Temperature */}
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
          <p className="text-[10px] text-slate-400">
            {settings.whiteBalance < 4500 ? 'Cool tungsten/blue hour tint' : settings.whiteBalance > 6000 ? 'Warm Golden Hour sunset glow' : 'Neutral daylight balance'}
          </p>
        </div>

        {/* 3. Exposure Compensation EV */}
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

        {/* 4. ISO Speed */}
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