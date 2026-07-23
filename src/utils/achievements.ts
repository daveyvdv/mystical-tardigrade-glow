import { CapturedPhoto, AchievementBadge } from '../types/camera';

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'first_shot',
    title: 'First Frame',
    description: 'Capture your first photography attempt with live analysis.',
    iconName: 'Camera',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'thirds_master',
    title: 'Rule of Thirds Master',
    description: 'Shoot 3 photos scoring over 85% using the Rule of Thirds grid.',
    iconName: 'Grid',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'perfect_level',
    title: 'Precision Horizon',
    description: 'Capture a shot with a perfectly level horizon (0.0° tilt).',
    iconName: 'Compass',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'lighting_guru',
    title: 'Lighting Guru',
    description: 'Achieve a 90%+ Lighting & Exposure score in any photo.',
    iconName: 'Sun',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'mode_explorer',
    title: 'Master of All Modes',
    description: 'Take at least 1 photo in each photography mode (Portrait, Landscape, Architecture, Macro, Street).',
    iconName: 'Award',
    unlocked: false,
    progress: 0,
  },
  {
    id: 'portfolio_10',
    title: 'Pro Collector',
    description: 'Build a portfolio containing 10 high quality captured photos.',
    iconName: 'Sparkles',
    unlocked: false,
    progress: 0,
  }
];

export function calculateAchievements(photos: CapturedPhoto[]): AchievementBadge[] {
  return INITIAL_ACHIEVEMENTS.map((badge) => {
    let unlocked = false;
    let progress = 0;

    switch (badge.id) {
      case 'first_shot':
        unlocked = photos.length >= 1;
        progress = Math.min(100, (photos.length / 1) * 100);
        break;

      case 'thirds_master': {
        const count = photos.filter(
          (p) => p.analysis.guideUsed === 'thirds' && p.analysis.compositionScore >= 85
        ).length;
        unlocked = count >= 3;
        progress = Math.min(100, Math.round((count / 3) * 100));
        break;
      }

      case 'perfect_level':
        unlocked = photos.some((p) => p.analysis.levelScore >= 98);
        progress = unlocked ? 100 : 0;
        break;

      case 'lighting_guru':
        unlocked = photos.some((p) => p.analysis.lightingScore >= 90);
        progress = unlocked ? 100 : 0;
        break;

      case 'mode_explorer': {
        const modes = new Set(photos.map((p) => p.analysis.modeUsed));
        unlocked = modes.size >= 5;
        progress = Math.min(100, Math.round((modes.size / 5) * 100));
        break;
      }

      case 'portfolio_10':
        unlocked = photos.length >= 10;
        progress = Math.min(100, Math.round((photos.length / 10) * 100));
        break;
    }

    return {
      ...badge,
      unlocked,
      progress,
    };
  });
}