import React from 'react';
import { CapturedPhoto } from '../types/camera';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, CheckCircle, AlertTriangle, Download, Trash2, Camera, Sparkles, RefreshCw } from 'lucide-react';
import { showSuccess } from '../utils/toast';

interface PhotoReviewModalProps {
  photo: CapturedPhoto | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const PhotoReviewModal: React.FC<PhotoReviewModalProps> = ({ photo, onClose, onDelete }) => {
  if (!photo) return null;

  const { analysis, dataUrl, timestamp } = photo;
  const { overallScore, compositionScore, lightingScore, levelScore, feedback, strengths, brightness, contrast } = analysis;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30';
    if (score >= 70) return 'text-amber-400 border-amber-500/30 bg-amber-950/30';
    return 'text-rose-400 border-rose-500/30 bg-rose-950/30';
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `FrameCraft-${photo.id}.jpg`;
    link.click();
    showSuccess("Photo downloaded to your device!");
  };

  return (
    <Dialog open={!!photo} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800 text-white p-4 md:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Photo Analysis & Scorecard
            </DialogTitle>
            <span className="text-xs text-slate-400 font-mono">
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <DialogDescription className="text-slate-400 text-xs">
            Evaluated using rule of thirds framing, light contrast histograms, and level balance.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
          {/* Photo Image Display */}
          <div className="flex flex-col gap-3">
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-[4/3] flex items-center justify-center">
              <img src={dataUrl} alt="Captured shot" className="w-full h-full object-contain" />
              
              {/* Overall Score Badge Overlay */}
              <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2 shadow-xl">
                <Award className="w-5 h-5 text-amber-400" />
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Quality Rating</div>
                  <div className="text-lg font-bold font-mono text-emerald-400">{overallScore}/100</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button onClick={handleDownload} variant="outline" className="flex-1 bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200">
                <Download className="w-4 h-4 mr-2 text-emerald-400" />
                Save Image
              </Button>
              <Button
                onClick={() => {
                  onDelete(photo.id);
                  onClose();
                }}
                variant="outline"
                className="bg-rose-950/30 hover:bg-rose-900/50 border-rose-800/40 text-rose-300"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>

          {/* Breakdown Score & Feedback */}
          <div className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-slate-200 border-b border-slate-700 pb-2">Score Breakdown</h4>

              {/* Composition */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Composition & Framing</span>
                  <span className="font-mono font-bold text-amber-300">{compositionScore}%</span>
                </div>
                <Progress value={compositionScore} className="h-2 bg-slate-700" />
              </div>

              {/* Lighting */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Lighting & Exposure</span>
                  <span className="font-mono font-bold text-amber-300">{lightingScore}%</span>
                </div>
                <Progress value={lightingScore} className="h-2 bg-slate-700" />
              </div>

              {/* Level Horizon */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Horizon Leveling</span>
                  <span className="font-mono font-bold text-amber-300">{levelScore}%</span>
                </div>
                <Progress value={levelScore} className="h-2 bg-slate-700" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 text-slate-300">
                <div className="bg-slate-900/60 p-2 rounded border border-slate-700/40">
                  <span className="text-slate-400 block text-[10px]">Avg Brightness</span>
                  <span className="font-mono">{brightness} / 255</span>
                </div>
                <div className="bg-slate-900/60 p-2 rounded border border-slate-700/40">
                  <span className="text-slate-400 block text-[10px]">Dynamic Contrast</span>
                  <span className="font-mono">{contrast}%</span>
                </div>
              </div>
            </div>

            {/* Strengths */}
            {strengths.length > 0 && (
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 text-xs space-y-1">
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  What Worked Well
                </div>
                <ul className="list-disc list-inside space-y-1 text-emerald-200/90 pl-1">
                  {strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actionable Tips */}
            {feedback.length > 0 && (
              <div className="bg-slate-800/80 border border-amber-500/30 rounded-xl p-3 text-xs space-y-1">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Coach Recommendation
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                  {feedback.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <Button onClick={onClose} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
            <Camera className="w-4 h-4 mr-2" />
            Keep Shooting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};