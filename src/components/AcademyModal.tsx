import React from 'react';
import { PHOTO_LESSONS } from '../data/lessons';
import { CompositionGuideType, PhotographyMode } from '../types/camera';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, Lightbulb, Play } from 'lucide-react';

interface AcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLesson: (guide: CompositionGuideType, mode: PhotographyMode) => void;
}

export const AcademyModal: React.FC<AcademyModalProps> = ({ isOpen, onClose, onApplyLesson }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-zinc-950 border-amber-500/30 text-white p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-400">
            <BookOpen className="w-6 h-6 text-amber-400" />
            Photo Masterclass & Guided Lessons
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            Learn composition techniques, lighting balance, and visual story-telling. Select a lesson to set up your camera overlays instantly.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
          {PHOTO_LESSONS.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col justify-between"
            >
              <div className="relative h-36 bg-black overflow-hidden">
                <img
                  src={lesson.exampleImage}
                  alt={lesson.title}
                  className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-zinc-950/90 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-500/40 uppercase tracking-wide">
                  {lesson.category}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-white text-base mb-1">{lesson.title}</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">{lesson.description}</p>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Key Technique:
                    </span>
                    <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside pl-1">
                      {lesson.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    onApplyLesson(lesson.guideToUse, lesson.targetMode);
                    onClose();
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs mt-2"
                >
                  <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  Try Lesson in Camera
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};