import React, { useState } from 'react';
import { CapturedPhoto } from '../types/camera';
import { PhotoEditorModal } from './PhotoEditorModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, CheckCircle, AlertTriangle, Download, Trash2, Camera, Sparkles, FileText, Info, Sliders, Wand2, Loader2 } from 'lucide-react';
import { showSuccess } from '../utils/toast';
import { enhancePhotoWithAI } from '../utils/aiEnhancer';

interface PhotoReviewModalProps {
  photo: CapturedPhoto | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdateNotes?: (id: string, notes: string) => void;
  onSaveEditedPhoto?: (updatedPhoto: CapturedPhoto) => void;
}

export const PhotoReviewModal: React.FC<PhotoReviewModalProps> = ({
  photo,
  onClose,
  onDelete,
  onUpdateNotes,
  onSaveEditedPhoto,
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [notesText, setNotesText] = useState<string>('');
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [aiChanges, setAiChanges] = useState<string[] | null>(null);

  React.useEffect(() => {
    if (photo) {
      setNotesText(photo.notes || '');
      setAiChanges(null);
    }
  }, [photo]);

  if (!photo) return null;

  const { analysis, dataUrl, timestamp, manualSettings } = photo;
  const { overallScore, compositionScore, lightingScore, levelScore, feedback, strengths, brightness, contrast } = analysis;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `FrameCraft-${photo.id}.jpg`;
    link.click();
    showSuccess("Photo downloaded to your device!");
  };

  const handleSaveNotes = () => {
    if (onUpdateNotes) {
      onUpdateNotes(photo.id, notesText);
      showSuccess("Notes saved to portfolio!");
    }
  };

  const handleAIEnhance = async () => {
    setIsEnhancing(true);
    try {
      const result = await enhancePhotoWithAI(photo);
      setAiChanges(result.enhancementsMade);
      if (onSaveEditedPhoto) {
        onSaveEditedPhoto(result.enhancedPhoto);
      }
      showSuccess(`AI Auto-Enhancement complete! Score increased by +${result.scoreImprovement} pts.`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <>
      <Dialog open={!!photo && !isEditorOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-amber-500/30 text-white p-4 md:p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-400">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Photo Analysis & Scorecard
              </DialogTitle>
              <span className="text-xs text-zinc-400 font-mono">
                {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
            <DialogDescription className="text-zinc-400 text-xs">
              Evaluated using rule of thirds framing, light contrast histograms, and level balance.
            </DialogDescription>
          </DialogHeader>

          {/* AI Enhancement notification banner */}
          {aiChanges && aiChanges.length > 0 && (
            <div className="bg-amber-950/60 border border-amber-500/50 rounded-xl p-3 text-xs space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-amber-400" /> AI Photo Enhancements Applied:
              </div>
              <ul className="list-disc list-inside text-zinc-200 pl-1 space-y-0.5">
                {aiChanges.map((change, idx) => (
                  <li key={idx}>{change}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
            {/* Photo Image Display */}
            <div className="flex flex-col gap-3">
              <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-black aspect-[4/3] flex items-center justify-center">
                <img src={dataUrl} alt="Captured shot" className="w-full h-full object-contain" />
                
                {/* Overall Score Badge Overlay */}
                <div className="absolute top-3 right-3 bg-zinc-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 flex items-center gap-2 shadow-xl">
                  <Award className="w-5 h-5 text-amber-400" />
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Quality Rating</div>
                    <div className="text-lg font-bold font-mono text-amber-300">{overallScore}/100</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: AI Auto Enhance & Manual Darkroom Editor */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleAIEnhance}
                  disabled={isEnhancing}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20"
                >
                  {isEnhancing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5 mr-1.5" />
                      AI Auto-Enhance
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setIsEditorOpen(true)}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 text-xs font-semibold"
                >
                  <Sliders className="w-3.5 h-3.5 mr-1.5" />
                  Manual Editor
                </Button>
              </div>

              {/* EXIF Metadata Card */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-white font-semibold border-b border-zinc-800 pb-1">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>EXIF Shooting Data</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono text-zinc-300 pt-1">
                  <div>
                    <span className="text-zinc-500 block text-[9px]">Aperture</span>
                    <span>f/{manualSettings?.aperture.toFixed(1) || '2.8'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px]">ISO Speed</span>
                    <span>ISO {manualSettings?.iso || 200}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px]">White Balance</span>
                    <span>{manualSettings?.whiteBalance || 5500}K</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px]">Shutter Speed</span>
                    <span>1/250s</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px]">Aspect Ratio</span>
                    <span>{manualSettings?.aspectRatio || '3:2'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px]">Film Style</span>
                    <span className="capitalize">{manualSettings?.filmPreset || 'Natural'}</span>
                  </div>
                </div>
              </div>

              {/* Custom Notes Input */}
              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 space-y-1.5">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" /> Personal Shoot Notes:
                </label>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Add notes (e.g. Golden hour sunset at 5pm, 50mm lens...)"
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <Button onClick={handleSaveNotes} size="sm" variant="outline" className="text-[11px] h-7 bg-zinc-900 border-zinc-800 text-amber-300">
                  Save Notes
                </Button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Button onClick={handleDownload} variant="outline" className="flex-1 bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white text-xs">
                  <Download className="w-4 h-4 mr-2 text-amber-400" />
                  Save Image
                </Button>
                <Button
                  onClick={() => {
                    onDelete(photo.id);
                    onClose();
                  }}
                  variant="outline"
                  className="bg-rose-950/30 hover:bg-rose-900/50 border-rose-800/40 text-rose-300 text-xs"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Breakdown Score & Feedback */}
            <div className="space-y-4">
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-white border-b border-zinc-800 pb-2">Score Breakdown</h4>

                {/* Composition */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-300 font-medium">Composition & Framing</span>
                    <span className="font-mono font-bold text-amber-300">{compositionScore}%</span>
                  </div>
                  <Progress value={compositionScore} className="h-2 bg-zinc-800" />
                </div>

                {/* Lighting */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-300 font-medium">Lighting & Exposure</span>
                    <span className="font-mono font-bold text-amber-300">{lightingScore}%</span>
                  </div>
                  <Progress value={lightingScore} className="h-2 bg-zinc-800" />
                </div>

                {/* Level Horizon */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-300 font-medium">Horizon Leveling</span>
                    <span className="font-mono font-bold text-amber-300">{levelScore}%</span>
                  </div>
                  <Progress value={levelScore} className="h-2 bg-zinc-800" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 text-zinc-300">
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
                    <span className="text-zinc-400 block text-[10px]">Avg Brightness</span>
                    <span className="font-mono text-white">{brightness} / 255</span>
                  </div>
                  <div className="bg-zinc-950 p-2 rounded border border-zinc-800">
                    <span className="text-zinc-400 block text-[10px]">Dynamic Contrast</span>
                    <span className="font-mono text-white">{contrast}%</span>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              {strengths.length > 0 && (
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 text-xs space-y-1">
                  <div className="font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                    What Worked Well
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-zinc-200 pl-1">
                    {strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Tips */}
              {feedback.length > 0 && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs space-y-1">
                  <div className="font-semibold text-amber-300 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Coach Recommendation
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-zinc-300 pl-1">
                    {feedback.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-zinc-800">
            <Button onClick={onClose} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs">
              <Camera className="w-4 h-4 mr-2" />
              Keep Shooting
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Darkroom Post-Processing Editor Dialog */}
      <PhotoEditorModal
        photo={isEditorOpen ? photo : null}
        onClose={() => setIsEditorOpen(false)}
        onSaveEditedPhoto={(updatedPhoto) => {
          if (onSaveEditedPhoto) {
            onSaveEditedPhoto(updatedPhoto);
          }
          setIsEditorOpen(false);
        }}
      />
    </>
  );
};