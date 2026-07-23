import { PhotoLesson } from '../types/camera';

export const PHOTO_LESSONS: PhotoLesson[] = [
  {
    id: 'thirds-mastery',
    title: 'The Rule of Thirds',
    category: 'composition',
    description: 'Avoid placing subjects directly in the dead center. Place key elements along grid lines or at point intersections to create natural tension and interest.',
    guideToUse: 'thirds',
    targetMode: 'portrait',
    tips: [
      'In portraits, align the subject\'s eye along the top horizontal line.',
      'In landscapes, place the horizon along the bottom third line to emphasize sky, or top third line to emphasize ground.',
      'Intersection points (power points) naturally attract the human eye first.'
    ],
    exampleImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'golden-ratio',
    title: 'Fibonacci Spiral & Flow',
    category: 'composition',
    description: 'The Golden Spiral guides the viewer\'s eye through a smooth curved path ending at your main subject point.',
    guideToUse: 'golden_spiral',
    targetMode: 'macro',
    tips: [
      'Place focal details inside the smallest tightest loop of the spiral.',
      'Use background elements to follow the sweeping curve leading into the subject.',
      'Ideal for close-up shots, shell structures, swirling staircases, and still life.'
    ],
    exampleImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'leading-lines',
    title: 'Leading Lines & Depth',
    category: 'composition',
    description: 'Use natural lines in roads, bridges, fences, or shadow edges to pull the viewer into the frame.',
    guideToUse: 'leading_lines',
    targetMode: 'landscape',
    tips: [
      'Start lines near the bottom corners of the photo pointing towards the main focal point.',
      'Crank up depth by combining diagonal perspective lines with a low camera angle.',
      'Great for streets, architectural corridors, paths, and rivers.'
    ],
    exampleImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'soft-lighting',
    title: 'Mastering Soft vs Harsh Light',
    category: 'lighting',
    description: 'Avoid mid-day harsh direct overhead sun which creates dark raccoon eye shadows and high contrast blown highlights.',
    guideToUse: 'thirds',
    targetMode: 'portrait',
    tips: [
      'Shoot near windows, under open shade, or during golden hour (sunrise/sunset).',
      'Watch your dynamic histogram to make sure highlights stay below 5% clipping.',
      'Turn your subject slightly away from harsh direct sun for smooth facial shadows.'
    ],
    exampleImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'framing-within-frame',
    title: 'Sub-Framing Your Subject',
    category: 'composition',
    description: 'Use archways, tree branches, windows, or doorways to frame your subject inside the picture area.',
    guideToUse: 'framing',
    targetMode: 'architecture',
    tips: [
      'Keep the frame element slightly darker or out of focus to draw attention inside.',
      'Sub-framing gives immediate context and 3D depth to 2D photographs.',
      'Look for geometric cutouts in urban environments or foliage naturally surrounding subjects.'
    ],
    exampleImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  }
];