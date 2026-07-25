import React from 'react';
import { CameraManualSettings } from '../types/camera';
import { Focus, Ruler } from 'lucide-react';

interface DofCalculatorWidgetProps {
  settings: CameraManualSettings;
}

export const DofCalculatorWidget: React.FC<DofCalculatorWidgetProps> = ({ settings }) => {
  const { aperture, focalLength, subjectDistance } = settings;

  const coc = 0.029; 
  const f = focalLength;
  const N = aperture;

  const hyperfocalMeters = (f * f) / (N * coc * 1000);

  const s = subjectDistance;
  const nearLimitMeters = (s * hyperfocalMeters) / (hyperfocalMeters + (s - f / 1000));

  const denominatorFar = hyperfocalMeters - (s - f / 1000);
  const farLimitMeters = denominatorFar > 0 ? (s * hyperfocalMeters) / denominatorFar : Infinity;

  const totalDofMeters = farLimitMeters === Infinity ? Infinity : farLimitMeters - nearLimitMeters;

  let dofRating = 'Medium Depth';
  let dofColor = 'text-amber-300 border-amber-500/30 bg-amber-950/40';

  if (totalDofMeters < 0.3) {
    dofRating = 'Ultra Shallow (Creamy Bokeh)';
    dofColor = 'text-amber-400 border-amber-500/50 bg-amber-950/60';
  } else if (totalDofMeters < 1.2) {
    dofRating = 'Shallow Subject Isolation';
    dofColor = 'text-yellow-300 border-yellow-500/30 bg-yellow-950/40';
  } else if (farLimitMeters === Infinity || totalDofMeters > 5) {
    dofRating = 'Deep Field Focus (Sharp Horizon)';
    dofColor = 'text-white border-zinc-700 bg-zinc-900';
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white space-y-2.5">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <Focus className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-time Depth of Field (DOF) Optical Engine</span>
        </div>
        <span className={`px-2 py-0.5 text-[10px] rounded-full border ${dofColor}`}>
          {dofRating}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
        <div className="bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
          <span className="text-zinc-400 block text-[9px] flex items-center justify-center gap-1">
            <Ruler className="w-2.5 h-2.5 text-amber-400" /> Near Focus Limit
          </span>
          <span className="font-mono font-bold text-amber-300">{nearLimitMeters.toFixed(2)} m</span>
        </div>

        <div className="bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
          <span className="text-zinc-400 block text-[9px]">Subject Distance</span>
          <span className="font-mono font-bold text-white">{s.toFixed(1)} m</span>
        </div>

        <div className="bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
          <span className="text-zinc-400 block text-[9px]">Far Focus Limit</span>
          <span className="font-mono font-bold text-amber-200">
            {farLimitMeters === Infinity ? '∞ Infinity' : `${farLimitMeters.toFixed(2)} m`}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-zinc-400 bg-zinc-900/50 px-2 py-1 rounded">
        <span>Hyperfocal Sharpness Distance:</span>
        <span className="font-mono font-semibold text-amber-400">{hyperfocalMeters.toFixed(2)} meters</span>
      </div>
    </div>
  );
};