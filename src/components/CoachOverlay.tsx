import React from 'react';
import { CompositionGuideType, PhotographyMode } from '../types/camera';
import { Compass, CheckCircle2, Lightbulb } from 'lucide-react';

interface CoachOverlayProps {
  mode: PhotographyMode;
  guide: CompositionGuideType;
  tiltAngle: number;
  avgBrightness: number;
  overexposedPercent: number;
}

export const CoachOverlay: React.FC<CoachOverlayProps> = ({
  mode,
  guide,
  tiltAngle,
  avgBrightness,
  overexposedPercent,
}) => {
  const isLevel = Math.abs(tiltAngle) <= 1.5;

  const modeGuidance: Record<PhotographyMode, string> = {
    portrait: 'Place subject eyes along the top grid line for an engaging focal point.',
    landscape: 'Keep the horizon line level and use low angle for ground depth.',
    architecture: 'Align strong vertical pillars with center or diagonal lines.',
    macro: 'Get close, keep main detail inside the focal circle, use soft side light.',
    street: 'Anticipate motion and frame natural geometric shapes around subjects.'
  };

  return (
    <div className="absolute top-4 left-4 right-4 pointer-events-none z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      {/* Active Mode Banner */}
      <div className="bg-zinc-950/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 flex items-center gap-2 text-white text-xs shadow-lg">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span className="font-semibold capitalize text-amber-300">{mode} Mode</span>
        <span className="text-zinc-600">|</span>
        <span className="text-zinc-200 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          {modeGuidance[mode]}
        </span>
      </div>

      {/* Horizon Level Indicator Badge */}
      <div className={`backdrop-blur-md px-3 py-1.5 rounded-full border flex items-center gap-1.5 text-xs font-mono shadow-lg ${
        isLevel
          ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
          : 'bg-zinc-900/90 border-zinc-700 text-zinc-300'
      }`}>
        <Compass className={`w-3.5 h-3.5 ${isLevel ? 'text-amber-400' : 'text-zinc-400 animate-spin'}`} />
        <span>
          {isLevel ? 'Level 0.0°' : `Tilt: ${tiltAngle > 0 ? '+' : ''}${tiltAngle.toFixed(1)}°`}
        </span>
        {isLevel && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
      </div>
    </div>
  );
};