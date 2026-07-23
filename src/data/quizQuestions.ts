export interface QuizQuestion {
  id: string;
  image: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    question: 'In portrait photography, where should you ideally align the subject\'s eye line when using the Rule of Thirds grid?',
    options: [
      'Dead center of the frame',
      'Along the upper horizontal third line',
      'At the bottom right corner',
      'Outside the frame entirely'
    ],
    correctIndex: 1,
    explanation: 'Placing eyes along the upper third line creates natural engagement and leaves balanced room for the torso and background.'
  },
  {
    id: 'q2',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    question: 'When shooting a landscape with a river leading towards mountains, which composition technique works best?',
    options: [
      'Sub-Framing',
      'Leading Lines',
      'Center Circle',
      'Macro Bokeh'
    ],
    correctIndex: 1,
    explanation: 'Leading lines (like rivers, roads, or fences) guide the viewer\'s eye from the foreground into the background depth.'
  },
  {
    id: 'q3',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    question: 'What is a major problem with mid-day direct overhead sunlight for outdoor portraits?',
    options: [
      'Colors become too saturated',
      'It creates harsh dark shadows under the eyes ("raccoon eyes") and blown highlights',
      'The camera shutter speed becomes too slow',
      'It removes all contrast from the image'
    ],
    correctIndex: 1,
    explanation: 'Direct overhead light causes harsh shadows in eye sockets and under noses. Open shade or golden hour produces much softer, flattering portraits.'
  },
  {
    id: 'q4',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    question: 'Why do photographers use window archways or foliage as a "sub-frame"?',
    options: [
      'To make the photo file size smaller',
      'To give 3D depth, context, and focus attention directly onto the subject inside',
      'To make sure the horizon is crooked',
      'To overexpose the background'
    ],
    correctIndex: 1,
    explanation: 'Framing a subject inside architectural cutouts or foliage creates visual layers and draws the viewer directly to the focal point.'
  }
];