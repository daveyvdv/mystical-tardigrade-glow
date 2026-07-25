import { CameraRecipe } from '../types/camera';

export const CAMERA_RECIPES: CameraRecipe[] = [
  {
    id: 'golden_portrait',
    name: 'Sunset Bokeh Portrait',
    icon: '🌅',
    description: 'Flattering 85mm portrait setup with shallow f/1.8 background blur and golden hour warmth.',
    guide: 'thirds',
    mode: 'portrait',
    settings: {
      aperture: 1.8,
      whiteBalance: 6200,
      exposureEv: +0.3,
      focalLength: 85,
      filmPreset: 'pastel_portrait',
      lightDirection: 'golden_hour',
      aspectRatio: '4:5',
      meteringMode: 'center_weighted'
    }
  },
  {
    id: 'cinematic_street',
    name: 'Teal & Orange Street',
    icon: '🎬',
    description: '35mm documentary look with high contrast teal-orange color balance and 16:9 cinematic crop.',
    guide: 'leading_lines',
    mode: 'street',
    settings: {
      aperture: 4.0,
      whiteBalance: 5200,
      exposureEv: -0.2,
      focalLength: 35,
      filmPreset: 'teal_orange',
      lightDirection: 'backlit',
      aspectRatio: '16:9',
      meteringMode: 'matrix'
    }
  },
  {
    id: 'noir_architecture',
    name: 'Dramatic B&W Noir',
    icon: '🏛️',
    description: 'Monochrome high contrast 24mm setup for strong geometric shadows and leading line perspective.',
    guide: 'center',
    mode: 'architecture',
    settings: {
      aperture: 8.0,
      whiteBalance: 5500,
      exposureEv: -0.5,
      focalLength: 24,
      filmPreset: 'monochrome',
      lightDirection: 'midday_harsh',
      aspectRatio: '3:2',
      meteringMode: 'spot'
    }
  },
  {
    id: 'vivid_landscape',
    name: 'Fuji Vivid Landscape',
    icon: '🏞️',
    description: 'Deep f/11 focus across 16mm ultra-wide horizon with saturated skies and level framing.',
    guide: 'thirds',
    mode: 'landscape',
    settings: {
      aperture: 11.0,
      whiteBalance: 5600,
      exposureEv: 0,
      focalLength: 16,
      filmPreset: 'fuji_vivid',
      lightDirection: 'soft_side',
      aspectRatio: '16:9',
      meteringMode: 'matrix'
    }
  },
  {
    id: 'vintage_kodachrome',
    name: 'Retro 70s Kodachrome',
    icon: '📷',
    description: 'Classic 50mm film feel with warm shadows, 1:1 square crop, and soft side window lighting.',
    guide: 'framing',
    mode: 'macro',
    settings: {
      aperture: 2.8,
      whiteBalance: 6000,
      exposureEv: +0.2,
      focalLength: 50,
      filmPreset: 'kodachrome',
      lightDirection: 'soft_side',
      aspectRatio: '1:1',
      meteringMode: 'center_weighted'
    }
  }
];