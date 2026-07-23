import React from 'react';
import { CompositionGuideType, PhotographyMode } from '../../types/camera';
import { Sliders, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CameraToolbarProps {
  mode: PhotographyMode;
  setMode: (mode: PhotographyMode) => void;
  guide: CompositionGuideType;
  setGuide: (guide: CompositionGuideType) => void;
  timerDuration: number;
  setTimerDuration: (dur: number) => void;
  showManualTuning: boolean;
  setShowManualTuning: (show: boolean) => void;
  showHistogram: boolean;
  setShowHistogram: (show: boolean) => void;
}

export const CameraToolbar: React.FC<CameraToolbarProps> = ({
  mode,
  setMode,
  guide,
  setGuide,
  timerDuration,
  setTimerDuration,
  showManualTuning,
  setShowManualTuning,
  showHistogram,
  setShowHistogram,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {/* Mode Selector */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-400 font-medium">Mode:</span>
        <Select value={mode} onValueChange={(val) => setMode(val as PhotographyMode)}>
          <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-slate-100 text-xs h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
            <SelectItem value="portrait">👤 Portrait</SelectItem>
            <SelectItem value="landscape">🌄 Landscape</SelectItem>
            <SelectItem value="architecture">🏛️ Architecture</SelectItem>
            <SelectItem value="macro">🔍 Macro / Still</SelectItem>
            <SelectItem value="street">🏙️ Street</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Composition Guide Toggle Buttons */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-400 font-medium">Grid:</span>
        <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
          {(['thirds', 'golden_spiral', 'leading_lines', 'center', 'framing'] as CompositionGuideType[]).map((g) => (
            <button
              key={g}
              onClick={() => setGuide(g)}
              className={`px-2 py-1 rounded-md transition-colors capitalize ${
                guide === g ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300 hover:text-white'
              }`}
            >
              {g.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Self-Timer & Quick Tools */}
      <div className="flex items-center gap-1">
        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setTimerDuration(0)}
            className={`px-1.5 py-1 rounded text-[10px] font-mono ${timerDuration === 0 ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
          >
            Timer Off
          </button>
          <button
            onClick={() => setTimerDuration(3)}
            className={`px-1.5 py-1 rounded text-[10px] font-mono ${timerDuration === 3 ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
          >
            3s
          </button>
          <button
            onClick={() => setTimerDuration(5)}
            className={`px-1.5 py-1 rounded text-[10px] font-mono ${timerDuration === 5 ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
          >
            5s
          </button>
          <button
            onClick={() => setTimerDuration(10)}
            className={`px-1.5 py-1 rounded text-[10px] font-mono ${timerDuration === 10 ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
          >
            10s
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowManualTuning(!showManualTuning)}
          className={`h-8 text-xs border-slate-700 ${
            showManualTuning ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300' : 'bg-slate-800 text-slate-300'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 mr-1" />
          Pro Tuning
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistogram(!showHistogram)}
          className={`h-8 text-xs border-slate-700 ${
            showHistogram ? 'bg-amber-950/60 border-amber-500/40 text-amber-300' : 'bg-slate-800 text-slate-300'
          }`}
        >
          <Sun className="w-3.5 h-3.5 mr-1 text-amber-400" />
          Histogram
        </Button>
      </div>
    </div>
  );
};