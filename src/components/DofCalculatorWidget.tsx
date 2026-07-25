import React from 'react';
import { CameraManualSettings } from '../types/camera';
import { Focus, Ruler } from 'lucide-react';

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