import React from 'react';
import { Camera, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  photoCount: number;
  averageScore: number;
  unlockedBadgeCount: number;
  onOpenAcademy: () => void;
  onOpenAchievements: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  photoCount,
  averageScore,
  unlockedBadgeCount,
  onOpenAcademy,
  onOpenAchievements,
}) => {
  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Camera className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
              FrameCraft <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold font-mono">Pro Camera</span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Composition Guides • Live Histogram • Pro Tuning • Photo Scorecard
            </p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2.5">
          {photoCount > 0 && (
            <div className="hidden sm:flex items-center gap-3 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700/80 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Shots</span>
                <span className="font-mono font-bold text-slate-200">{photoCount}</span>
              </div>
              <div className="h-6 w-[1px] bg-slate-700" />
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Avg Score</span>
                  <span className="font-mono font-bold text-emerald-400">{averageScore}</span>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            onClick={onOpenAchievements}
            className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300 font-semibold text-xs h-9 px-3"
          >
            <Award className="w-4 h-4 mr-1 text-amber-400" />
            Badges ({unlockedBadgeCount})
          </Button>

          <Button
            onClick={onOpenAcademy}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs h-9 px-3.5 shadow-md shadow-emerald-600/20"
          >
            <BookOpen className="w-4 h-4 mr-1.5" />
            Learn Rules
          </Button>
        </div>
      </div>
    </header>
  );
};