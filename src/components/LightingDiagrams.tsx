import React, { useState } from 'react';
import { Sun, Camera, User, Lightbulb, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LightingSetup {
  id: string;
  name: string;
  description: string;
  bestFor: string;
  keyLightAngle: string;
  diagram: {
    keyLight: { x: number; y: number; label: string };
    fillReflector?: { x: number; y: number; label: string };
    subject: { x: number; y: number };
    camera: { x: number; y: number };
  };
}

const LIGHTING_SETUPS: LightingSetup[] = [
  {
    id: 'rembrandt',
    name: 'Rembrandt 45° Lighting',
    description: 'Place primary light 45° to the side and slightly above head level. Creates a signature small triangle of light on the shadowed cheek.',
    bestFor: 'Dramatic portraits, cinematic interviews, artistic headshots.',
    keyLightAngle: '45° Side / Elevated',
    diagram: {
      keyLight: { x: 25, y: 30, label: 'Main Soft Light (45°)' },
      fillReflector: { x: 75, y: 40, label: 'Reflector Board' },
      subject: { x: 50, y: 35 },
      camera: { x: 50, y: 80 },
    },
  },
  {
    id: 'window_soft',
    name: 'Soft Window Side-Light',
    description: 'Position subject perpendicular to a large window. Soft diffused light wraps around features without harsh shadow lines.',
    bestFor: 'Natural light portraits, food, still life.',
    keyLightAngle: '90° Side Window',
    diagram: {
      keyLight: { x: 15, y: 45, label: 'Large Window' },
      fillReflector: { x: 80, y: 45, label: 'White Fill Card' },
      subject: { x: 50, y: 45 },
      camera: { x: 50, y: 80 },
    },
  },
  {
    id: 'backlit_rim',
    name: 'Backlit / Golden Sunset Rim',
    description: 'Position light directly behind the subject facing towards camera. Creates glowing hair rim highlights and dramatic silhouettes.',
    bestFor: 'Golden hour outdoor portraits, dramatic mood shots.',
    keyLightAngle: '180° Directly Behind',
    diagram: {
      keyLight: { x: 50, y: 15, label: 'Sun / Rim Light' },
      fillReflector: { x: 50, y: 60, label: 'Fill Reflector' },
      subject: { x: 50, y: 35 },
      camera: { x: 50, y: 80 },
    },
  },
];

export const LightingDiagrams: React.FC = () => {
  const [activeSetup, setActiveSetup] = useState<LightingSetup>(LIGHTING_SETUPS[0]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-base text-slate-100">Studio & Natural Lighting Setup Diagrams</h3>
        </div>
        <span className="text-xs text-amber-300 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-500/30 font-medium">
          Overhead Top-Down View
        </span>
      </div>

      {/* Setup selector tabs */}
      <div className="flex flex-wrap gap-2">
        {LIGHTING_SETUPS.map((setup) => (
          <button
            key={setup.id}
            onClick={() => setActiveSetup(setup)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              activeSetup.id === setup.id
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {setup.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Overhead Diagram Viewport */}
        <div className="relative aspect-square max-h-[280px] bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col items-center justify-between overflow-hidden">
          {/* Grid background lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

          {/* Key Light Indicator */}
          <div
            className="absolute flex flex-col items-center gap-1 transition-all duration-300 -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${activeSetup.diagram.keyLight.x}%`, top: `${activeSetup.diagram.keyLight.y}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-pulse">
              <Sun className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-amber-300 bg-black/80 px-1.5 py-0.5 rounded border border-amber-500/30 whitespace-nowrap">
              {activeSetup.diagram.keyLight.label}
            </span>
          </div>

          {/* Fill / Reflector Indicator */}
          {activeSetup.diagram.fillReflector && (
            <div
              className="absolute flex flex-col items-center gap-1 transition-all duration-300 -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${activeSetup.diagram.fillReflector.x}%`, top: `${activeSetup.diagram.fillReflector.y}%` }}
            >
              <div className="w-7 h-7 rounded-lg bg-cyan-400/80 text-slate-950 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-black/80 px-1.5 py-0.5 rounded border border-cyan-500/30 whitespace-nowrap">
                {activeSetup.diagram.fillReflector.label}
              </span>
            </div>
          )}

          {/* Subject Position */}
          <div
            className="absolute flex flex-col items-center gap-1 transition-all duration-300 -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${activeSetup.diagram.subject.x}%`, top: `${activeSetup.diagram.subject.y}%` }}
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-emerald-300 bg-black/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
              Subject
            </span>
          </div>

          {/* Camera Position */}
          <div
            className="absolute flex flex-col items-center gap-1 transition-all duration-300 -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${activeSetup.diagram.camera.x}%`, top: `${activeSetup.diagram.camera.y}%` }}
          >
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-black/80 px-1.5 py-0.5 rounded border border-purple-500/30">
              Your Camera
            </span>
          </div>
        </div>

        {/* Setup Breakdown & Tips */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block">Light Placement Angle</span>
            <h4 className="text-base font-bold text-slate-100">{activeSetup.name}</h4>
          </div>

          <p className="text-slate-300 leading-relaxed">{activeSetup.description}</p>

          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400 block text-[11px]">✨ Best Used For:</span>
            <p className="text-slate-300">{activeSetup.bestFor}</p>
          </div>
        </div>
      </div>
    </div>
  );
};