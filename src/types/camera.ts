export type CompositionGuideType = 'thirds' | 'golden_spiral' | 'leading_lines' | 'center' | 'framing' | 'none';

export type PhotographyMode = 'portrait' | 'landscape' | 'architecture' | 'macro' | 'street';

export type AspectRatioType = '3:2' | '4:5' | '1:1' | '16:9' | '2.39:1';

export type FilmPresetType = 'standard' | 'monochrome' | 'kodachrome' | 'teal_orange' | 'pastel_portrait' | 'fuji_vivid';

export type LightDirectionType = 'golden_hour' | 'soft_side' | 'midday_harsh' | 'backlit';

export type MeteringModeType = 'matrix' | 'center_weighted' | 'spot';

export interface PhotoAnalysis {
  overallScore: number;
  compositionScore: number;
  lightingScore: number;
  levelScore: number;
  brightness: number; // 0 - 255
  contrast: number;   // 0 - 100
  overexposedPercent: number; // 0 - 100
  underexposedPercent: number; // 0 - 100
  feedback: string[];
  strengths: string[];
  guideUsed: CompositionGuideType;
  modeUsed: PhotographyMode;
}

export interface CameraManualSettings {
  aperture: number; // f/1.4 to f/16 (affects bokeh blur)
  whiteBalance: number; // Kelvin 2700K (warm) to 8000K (cool)
  exposureEv: number; // -2.0 to +2.0
  iso: number; // 100 to 3200 (affects grain)
  filmPreset: FilmPresetType;
  aspectRatio: AspectRatioType;
  lightDirection: LightDirectionType;
  focalLength: number; // 16mm, 24mm, 35mm, 50mm, 85mm, 135mm, 200mm
  subjectDistance: number; // 0.5m to 15m
  meteringMode: MeteringModeType;
}

export interface CameraRecipe {
  id: string;
  name: string;
  icon: string;
  description: string;
  guide: CompositionGuideType;
  mode: PhotographyMode;
  settings: Partial<CameraManualSettings>;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: Date;
  analysis: PhotoAnalysis;
  manualSettings?: CameraManualSettings;
  title?: string;
  notes?: string;
  tags?: string[];
}

export interface PhotoLesson {
  id: string;
  title: string;
  category: 'composition' | 'lighting' | 'angle';
  description: string;
  guideToUse: CompositionGuideType;
  targetMode: PhotographyMode;
  tips: string[];
  exampleImage: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  progress: number; // 0 - 100
}