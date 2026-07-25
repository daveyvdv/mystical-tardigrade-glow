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
    <header className="w-full bg-zinc-950/90 backdrop-blur-md border-b border-amber-500/20 sticky top-0 z-40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Camera className="w-5 h-5 text-zinc-950 font-bold" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
              FrameCraft <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 font-semibold font-mono">Gold Pro</span>
            </h1>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Composition Guides • Live Histogram • Pro Tuning • Photo Scorecard
            </p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onOpenAchievements}
            className="bg-zinc-900 hover:bg-zinc-800 border-amber-500/30 text-amber-300 hover:text-white font-semibold text-xs h-9 px-3"
          >
            <Award className="w-4 h-4 mr-1 text-amber-400" />
            Badges ({unlockedBadgeCount})
          </Button>

          <Button
            onClick={onOpenAcademy}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs h-9 px-3.5 shadow-md shadow-amber-500/20"
          >
            <BookOpen className="w-4 h-4 mr-1.5" />
            Learn Rules
          </Button>
        </div>
      </div>
    </header>
  );
};