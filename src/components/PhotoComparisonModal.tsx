import React from 'react';
import { CapturedPhoto } from '../types/camera';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Award, Sliders } from 'lucide-react';

interface PhotoComparisonModalProps {
  photoA: CapturedPhoto | null;
  photoB: CapturedPhoto | null;
  onClose: () => void;
}

export const PhotoComparisonModal: React.FC<PhotoComparisonModalProps> = ({ photoA, photoB, onClose }) => {
  if (!photoA || !photoB) return null;

  const scoreDiff = photoB.analysis.overallScore - photoA.analysis.overallScore;

  return (
    <Dialog open={!!photoA && !!photoB} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-amber-500/30 text-white p-4 md:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-400">
            <Sliders className="w-5 h-5 text-amber-400" />
            Side-by-Side Photo Comparison
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-xs">
            Analyze composition tweaks, lighting changes, and rating differences between two shots.
          </DialogDescription>
        </DialogHeader>

        {/* Difference summary banner */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between my-2 text-xs">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-semibold text-white">Quality Score Delta:</span>
          </div>
          <div className="font-mono text-sm font-bold">
            {scoreDiff > 0 ? (
              <span className="text-amber-300">+{scoreDiff} pts Improvement! 🚀</span>
            ) : scoreDiff < 0 ? (
              <span className="text-rose-400">{scoreDiff} pts lower</span>
            ) : (
              <span className="text-zinc-400">Identical scores</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
          {/* Photo A */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 space-y-3">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span className="font-semibold text-white">Shot A (Earlier)</span>
              <span className="font-mono">{new Date(photoA.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-zinc-800 bg-black flex items-center justify-center">
              <img src={photoA.dataUrl} alt="Shot A" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Overall Rating:</span>
                <span className="font-mono font-bold text-amber-400">{photoA.analysis.overallScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Composition:</span>
                <span className="font-mono text-white">{photoA.analysis.compositionScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Lighting & Contrast:</span>
                <span className="font-mono text-white">{photoA.analysis.lightingScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Guide Used:</span>
                <span className="font-mono capitalize text-amber-300">{photoA.analysis.guideUsed.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Photo B */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 space-y-3">
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span className="font-semibold text-white">Shot B (Later)</span>
              <span className="font-mono">{new Date(photoB.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-zinc-800 bg-black flex items-center justify-center">
              <img src={photoB.dataUrl} alt="Shot B" className="w-full h-full object-contain" />
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Overall Rating:</span>
                <span className="font-mono font-bold text-amber-300">{photoB.analysis.overallScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Composition:</span>
                <span className="font-mono text-white">{photoB.analysis.compositionScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Lighting & Contrast:</span>
                <span className="font-mono text-white">{photoB.analysis.lightingScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Guide Used:</span>
                <span className="font-mono capitalize text-amber-300">{photoB.analysis.guideUsed.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};