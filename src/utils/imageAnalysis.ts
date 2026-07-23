import { CompositionGuideType, PhotoAnalysis, PhotographyMode } from '../types/camera';

export interface ImageLuminanceData {
  histogram: number[]; // 256 bins
  avgBrightness: number;
  contrast: number;
  overexposedPercent: number;
  underexposedPercent: number;
}

export function analyzeCanvasLuminance(canvas: HTMLCanvasElement): ImageLuminanceData {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      histogram: new Array(256).fill(0),
      avgBrightness: 128,
      contrast: 50,
      overexposedPercent: 0,
      underexposedPercent: 0,
    };
  }

  const { width, height } = canvas;
  // Sample down for performance if canvas is huge
  const sampleWidth = Math.min(width, 320);
  const sampleHeight = Math.min(height, 240);
  
  const offCanvas = document.createElement('canvas');
  offCanvas.width = sampleWidth;
  offCanvas.height = sampleHeight;
  const offCtx = offCanvas.getContext('2d');
  if (!offCtx) {
    return {
      histogram: new Array(256).fill(0),
      avgBrightness: 128,
      contrast: 50,
      overexposedPercent: 0,
      underexposedPercent: 0,
    };
  }

  offCtx.drawImage(canvas, 0, 0, sampleWidth, sampleHeight);
  const imageData = offCtx.getImageData(0, 0, sampleWidth, sampleHeight);
  const data = imageData.data;
  const totalPixels = data.length / 4;

  const histogram = new Array(256).fill(0);
  let totalLuminance = 0;
  let overexposedCount = 0;
  let underexposedCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Standard relative luminance formula
    const lum = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    histogram[lum]++;
    totalLuminance += lum;

    if (lum > 245) overexposedCount++;
    if (lum < 15) underexposedCount++;
  }

  const avgBrightness = Math.round(totalLuminance / totalPixels);

  // Calculate Variance for Contrast estimation
  let varianceSum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    varianceSum += Math.pow(lum - avgBrightness, 2);
  }
  const stdDev = Math.sqrt(varianceSum / totalPixels);
  const contrast = Math.min(100, Math.round((stdDev / 128) * 100));

  return {
    histogram,
    avgBrightness,
    contrast,
    overexposedPercent: Math.round((overexposedCount / totalPixels) * 100),
    underexposedPercent: Math.round((underexposedCount / totalPixels) * 100),
  };
}

export function generatePhotoScore(
  lumData: ImageLuminanceData,
  guide: CompositionGuideType,
  mode: PhotographyMode,
  tiltAngle: number // degrees from level 0
): PhotoAnalysis {
  const feedback: string[] = [];
  const strengths: string[] = [];

  // 1. Lighting Score calculation (0 - 100)
  let lightingScore = 85;

  if (lumData.avgBrightness < 60) {
    lightingScore -= 20;
    feedback.push("Image is underexposed. Try adding more ambient light or moving closer to a light source.");
  } else if (lumData.avgBrightness > 195) {
    lightingScore -= 20;
    feedback.push("Image is overexposed. Shadow highlight details are washed out.");
  } else {
    strengths.push("Well-balanced overall exposure.");
  }

  if (lumData.overexposedPercent > 8) {
    lightingScore -= 15;
    feedback.push(`${lumData.overexposedPercent}% clipped highlights detected. Lower exposure to avoid harsh blown-out spots.`);
  }

  if (lumData.underexposedPercent > 12) {
    lightingScore -= 10;
    feedback.push("Deep pitch shadows lose details. Fill in lighting would improve texture.");
  }

  if (lumData.contrast > 25 && lumData.contrast < 80) {
    strengths.push("Excellent dynamic contrast range.");
  } else if (lumData.contrast <= 25) {
    lightingScore -= 10;
    feedback.push("Low contrast detected. Flat lighting makes the subject blend into background.");
  }

  lightingScore = Math.max(30, Math.min(100, lightingScore));

  // 2. Horizon Level Score
  const absTilt = Math.abs(tiltAngle);
  let levelScore = 100;
  if (absTilt > 1.5 && absTilt <= 4) {
    levelScore = 80;
    feedback.push(`Slight horizontal tilt (${tiltAngle.toFixed(1)}°). Straighten your camera with the horizon overlay.`);
  } else if (absTilt > 4) {
    levelScore = 55;
    feedback.push(`Noticeable tilt of ${tiltAngle.toFixed(1)}°. Straightening horizon line dramatically enhances professional look.`);
  } else {
    strengths.push("Perfectly level shot!");
  }

  // 3. Composition Score
  let compositionScore = 80;
  
  if (guide !== 'none') {
    compositionScore += 10;
    strengths.push(`Utilized ${guide.replace('_', ' ')} grid structure for deliberate framing.`);
  } else {
    feedback.push("Consider turning on a composition overlay (e.g. Rule of Thirds) to guide focal points.");
  }

  // Mode specific checks
  if (mode === 'portrait' && guide === 'thirds') {
    compositionScore += 5;
    strengths.push("Rule of Thirds is optimal for placing subject eyes along the upper grid line.");
  } else if (mode === 'landscape' && levelScore < 85) {
    compositionScore -= 10;
    feedback.push("Landscapes rely heavily on a straight horizon to feel balanced.");
  } else if (mode === 'architecture' && (guide === 'leading_lines' || guide === 'center')) {
    compositionScore += 5;
    strengths.push("Great guide choice for architectural perspective lines!");
  }

  compositionScore = Math.max(40, Math.min(100, compositionScore));

  const overallScore = Math.round((lightingScore * 0.4) + (compositionScore * 0.4) + (levelScore * 0.2));

  return {
    overallScore,
    compositionScore,
    lightingScore,
    levelScore,
    brightness: lumData.avgBrightness,
    contrast: lumData.contrast,
    overexposedPercent: lumData.overexposedPercent,
    underexposedPercent: lumData.underexposedPercent,
    feedback: feedback.length > 0 ? feedback : ["Great execution! Solid lighting and framing composition."],
    strengths: strengths.length > 0 ? strengths : ["Good camera stability."],
    guideUsed: guide,
    modeUsed: mode
  };
}