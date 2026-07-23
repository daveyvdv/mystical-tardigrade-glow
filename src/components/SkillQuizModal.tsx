import React, { useState } from 'react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/quizQuestions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle2, XCircle, Sparkles, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { showSuccess } from '../utils/toast';

interface SkillQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SkillQuizModal: React.FC<SkillQuizModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (!isSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
      showSuccess(`Quiz Complete! Score: ${score + (selectedOption === currentQ.correctIndex ? 1 : 0)}/${QUIZ_QUESTIONS.length}`);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsSubmitted(false);
    setIsFinished(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-white p-4 md:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-emerald-400">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Photo Eye Skill Challenge
            </DialogTitle>
            {!isFinished && (
              <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono border border-slate-700">
                Question {currentIndex + 1} / {QUIZ_QUESTIONS.length}
              </span>
            )}
          </div>
          <DialogDescription className="text-slate-400 text-xs">
            Test your visual judgment on lighting errors, horizon balance, and framing techniques.
          </DialogDescription>
        </DialogHeader>

        {isFinished ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <Award className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">Trainer Challenge Complete!</h3>
              <p className="text-slate-400 text-xs mt-1">
                You scored <span className="text-emerald-400 font-bold font-mono text-base">{score}</span> out of {QUIZ_QUESTIONS.length} correct answers.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button onClick={handleRestart} variant="outline" className="bg-slate-800 border-slate-700 text-slate-200 text-xs">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Try Again
              </Button>
              <Button onClick={onClose} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs">
                Return to Camera
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 my-2">
            {/* Question Image */}
            <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img src={currentQ.image} alt="Quiz scenario" className="w-full h-full object-cover" />
            </div>

            {/* Question text */}
            <p className="text-sm font-semibold text-slate-200">{currentQ.question}</p>

            {/* Answer Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700';

                if (isSubmitted) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-300 font-semibold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-950 border-rose-500 text-rose-300';
                  }
                } else if (selectedOption === idx) {
                  btnStyle = 'bg-amber-950 border-amber-500 text-amber-300 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {isSubmitted && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after submit */}
            {isSubmitted && (
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs space-y-1">
                <span className="font-semibold text-amber-400 block">💡 Explanation:</span>
                <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end pt-2 border-t border-slate-800">
              {!isSubmitted ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Confirm Answer
                </Button>
              ) : (
                <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold">
                  Next Question <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};