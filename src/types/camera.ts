export type CompositionGuideType = 'thirds' | 'golden_spiral' | 'leading_lines' | 'center' | 'framing' | 'none';

export type PhotographyMode = 'portrait' | 'landscape' | 'architecture' | 'macro' | 'street';

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

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: Date;
  analysis: PhotoAnalysis;
  title?: string;
  notes?: string;
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