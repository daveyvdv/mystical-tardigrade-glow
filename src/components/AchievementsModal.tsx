import React from 'react';
import { AchievementBadge } from '../types/camera';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Award, Camera, Grid, Compass, Sun, Sparkles, Lock, CheckCircle2 } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: AchievementBadge[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, achievements }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'Grid': return <Grid className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border-slate-800 text-white p-4 md:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-400">
              <Award className="w-6 h-6 text-amber-400" />
              Photographer Mastery Badges
            </DialogTitle>
            <span className="text-xs bg-amber-950 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/40 font-semibold font-mono">
              {unlockedCount} / {achievements.length} Unlocked
            </span>
          </div>
          <DialogDescription className="text-slate-400 text-xs">
            Complete composition challenges, leveling targets, and lighting techniques to earn badges.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`p-3.5 rounded-xl border flex gap-3 transition-all ${
                a.unlocked
                  ? 'bg-slate-800/80 border-amber-500/50 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 opacity-60'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                a.unlocked ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500'
              }`}>
                {a.unlocked ? getIcon(a.iconName) : <Lock className="w-4 h-4" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-100">{a.title}</h4>
                  {a.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{a.description}</p>
                {!a.unlocked && (
                  <div className="pt-1">
                    <Progress value={a.progress} className="h-1.5 bg-slate-800" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};