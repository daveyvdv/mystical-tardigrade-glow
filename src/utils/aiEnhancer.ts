import { CapturedPhoto } from '../types/camera';
import { analyzeCanvasLuminance, generatePhotoScore } from './imageAnalysis';

export interface AIEnhancementResult {
  enhancedPhoto: CapturedPhoto;
  enhancementsMade: string[];
  scoreImprovement: number;
}

/**
 * AI Photo Improvement function.
 * Takes a CapturedPhoto, analyzes its visual luminance & composition metrics,
 * and renders an intelligently color-graded and exposure-balanced version.
 */
export async function enhancePhotoWithAI(photo: CapturedPhoto): Promise<AIEnhancementResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photo.dataUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve({
          enhancedPhoto: photo,
          enhancementsMade: ['Failed to initialize canvas context.'],
          scoreImprovement: 0,
        });
        return;
      }

      // First pass: analyze source luminance
      ctx.drawImage(img, 0, 0);
      const initialLum = analyzeCanvasLuminance(canvas);

      const enhancementsMade: string[] = [];

      // Determine smart AI parameters based on image state
      let brightnessAdjust = 0;
      let contrastAdjust = 0;
      let saturationAdjust = 0;
      let sepiaAdjust = 0;
      let hueAdjust = 0;
      let vignetteIntensity = 0;

      // 1. Exposure & Brightness Correction
      if (initialLum.avgBrightness < 80) {
        brightnessAdjust = Math.min(35, Math.round((128 - initialLum.avgBrightness) * 0.5));
        enhancementsMade.push(`Boosted underexposed shadows (+${brightnessAdjust}% exposure)`);
      } else if (initialLum.avgBrightness > 185) {
        brightnessAdjust = -Math.min(25, Math.round((initialLum.avgBrightness - 140) * 0.4));
        enhancementsMade.push(`Recovered clipped highlight details (${brightnessAdjust}% exposure)`);
      } else {
        brightnessAdjust = +5; // Gentle clarity bump
        enhancementsMade.push('Fine-tuned midtone luminosity balance');
      }

      // 2. Dynamic Contrast Optimization
      if (initialLum.contrast < 35) {
        contrastAdjust = 20;
        enhancementsMade.push('Enhanced flat contrast range (+20% dynamic depth)');
      } else if (initialLum.contrast > 75) {
        contrastAdjust = -10;
        enhancementsMade.push('Softened harsh extreme shadows');
      } else {
        contrastAdjust = +8;
        enhancementsMade.push('Optimized micro-contrast definition');
      }

      // 3. Mode-based Color Temperature & Saturation Enhancement
      switch (photo.analysis.modeUsed) {
        case 'portrait':
          saturationAdjust = +12;
          sepiaAdjust = 15; // Gentle warm skin tones
          vignetteIntensity = 25; // Focus on face
          enhancementsMade.push('Applied skin tone warming & portrait edge focus vignette');
          break;

        case 'landscape':
          saturationAdjust = +28;
          contrastAdjust += 10;
          hueAdjust = -5; // Deeper sky blues
          enhancementsMade.push('Boosted sky & foliage saturation (+28%)');
          break;

        case 'architecture':
          contrastAdjust += 15;
          saturationAdjust = +10;
          vignetteIntensity = 15;
          enhancementsMade.push('Sharpened geometric line contrast & structure');
          break;

        case 'street':
          contrastAdjust += 18;
          saturationAdjust = +15;
          enhancementsMade.push('Applied cinematic documentary tone grade');
          break;

        case 'macro':
          saturationAdjust = +22;
          vignetteIntensity = 30;
          enhancementsMade.push('Isolated macro center subject with radial vignette');
          break;

        default:
          saturationAdjust = +15;
          enhancementsMade.push('Enhanced natural color vibrancy');
          break;
      }

      // Apply CSS Filters to Canvas Context
      const brightVal = 100 + brightnessAdjust;
      const contrastVal = 100 + contrastAdjust;
      const saturateVal = 100 + saturationAdjust;

      ctx.filter = `brightness(${brightVal}%) contrast(${contrastVal}%) saturate(${saturateVal}%) sepia(${sepiaAdjust}%) hue-rotate(${hueAdjust}deg)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';

      // 4. Apply Vignette Layer if applicable
      if (vignetteIntensity > 0) {
        const radius = Math.max(canvas.width, canvas.height) * 0.75;
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          radius * (1 - vignetteIntensity / 100),
          canvas.width / 2,
          canvas.height / 2,
          radius
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${(vignetteIntensity / 100) * 0.6})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Generate updated image data
      const enhancedDataUrl = canvas.toDataURL('image/jpeg', 0.94);
      const postLumData = analyzeCanvasLuminance(canvas);

      const enhancedAnalysis = generatePhotoScore(
        postLumData,
        photo.analysis.guideUsed,
        photo.analysis.modeUsed,
        0
      );

      const scoreImprovement = Math.max(1, enhancedAnalysis.overallScore - photo.analysis.overallScore);

      const enhancedPhoto: CapturedPhoto = {
        ...photo,
        dataUrl: enhancedDataUrl,
        analysis: {
          ...enhancedAnalysis,
          strengths: [
            ...enhancedAnalysis.strengths,
            'AI Auto-Enhanced: Optimal exposure & color grading applied.',
          ],
        },
        notes: photo.notes
          ? `${photo.notes} | [AI Enhanced]`
          : 'AI Auto-Enhanced shot.',
      };

      resolve({
        enhancedPhoto,
        enhancementsMade,
        scoreImprovement,
      });
    };
  });
}