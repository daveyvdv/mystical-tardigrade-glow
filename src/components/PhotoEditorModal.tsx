import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CapturedPhoto } from '../types/camera';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sliders, Sun, Flame, Contrast, Palette, RotateCcw, Save, Sparkles, Eye, Wand2, Loader2, User, Mountain, Film, Moon, Focus } from 'lucide-react';
import { analyzeCanvasLuminance, generatePhotoScore } from '../utils/imageAnalysis';
import { enhancePhotoWithAI, AISpecialtyPreset } from '../utils/aiEnhancer';
import { showSuccess } from '../utils/toast';

interface PhotoEditorModalProps {
  photo: CapturedPhoto | null;
  onClose: () => void;
  onSaveEditedPhoto: (updatedPhoto: CapturedPhoto) => void;
}

export const PhotoEditorModal: React.FC<PhotoEditorModalProps> = ({ photo, onClose, onSaveEditedPhoto }) => {
  if (!photo) return null;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [vignette, setVignette] = useState<number>(0);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>(photo.dataUrl);
  const [newScore, setNewScore] = useState<number>(photo.analysis.overallScore);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [activeAIPreset, setActiveAIPreset] = useState<AISpecialtyPreset | null>(null);

  const handleReset = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setTemperature(0);
    setVignette(0);
    setActiveAIPreset(null);
    setPreviewDataUrl(photo.dataUrl);
    setNewScore(photo.analysis.overallScore);
  };

  const renderEdits = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photo.dataUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      const brightVal = 100 + brightness;
      const contrastVal = 100 + contrast;
      const saturateVal = 100 + saturation;
      const sepiaVal = temperature > 0 ? temperature * 0.6 : 0;
      const hueVal = temperature < 0 ? temperature * 0.4 : 0;

      ctx.filter = `brightness(${brightVal}%) contrast(${contrastVal}%) saturate(${saturateVal}%) sepia(${sepiaVal}%) hue-rotate(${hueVal}deg)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.filter = 'none';

      if (vignette > 0) {
        const radius = Math.max(canvas.width, canvas.height) * 0.7;
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          radius * (1 - vignette / 120),
          canvas.width / 2,
          canvas.height / 2,
          radius
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, `rgba(0,0,0,${vignette / 100})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const editedUrl = canvas.toDataURL('image/jpeg', 0.92);
      setPreviewDataUrl(editedUrl);

      const lumData = analyzeCanvasLuminance(canvas);
      const updatedAnalysis = generatePhotoScore(
        lumData,
        photo.analysis.guideUsed,
        photo.analysis.modeUsed,
        0
      );
      setNewScore(updatedAnalysis.overallScore);
    };
  }, [photo, brightness, contrast, saturation, temperature, vignette]);

  useEffect(() => {
    if (!activeAIPreset) {
      renderEdits();
    }
  }, [renderEdits, activeAIPreset]);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const editedUrl = canvas.toDataURL('image/jpeg', 0.92);
    const lumData = analyzeCanvasLuminance(canvas);
    const updatedAnalysis = generatePhotoScore(
      lumData,
      photo.analysis.guideUsed,
      photo.analysis.modeUsed,
      0
    );

    const updatedPhoto: CapturedPhoto = {
      ...photo,
      dataUrl: editedUrl,
      analysis: updatedAnalysis,
    };

    onSaveEditedPhoto(updatedPhoto);
    showSuccess('Retouched image saved to portfolio!');
    onClose();
  };

  const handleRunAITool = async (preset: AISpecialtyPreset = 'auto') => {
    setIsEnhancing(true);
    setActiveAIPreset(preset);
    try {
      const result = await enhancePhotoWithAI(photo, preset);
      setPreviewDataUrl(result.enhancedPhoto.dataUrl);
      setNewScore(result.enhancedPhoto.analysis.overallScore);
      showSuccess(`Applied AI ${preset.replace('_', ' ')}! Rating boosted to ${result.enhancedPhoto.analysis.overallScore}/100.`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const scoreDiff = newScore - photo.analysis.overallScore;

  return (
    <Dialog open={!!photo} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-amber-500/30 text-white p-4 md:p-6">
        <canvas ref={canvasRef} className="hidden" />

        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-400">
              <Sliders className="w-5 h-5 text-amber-400" />
              Darkroom Post-Processing Laboratory
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button onClick={handleReset} variant="outline" size="sm" className="text-xs bg-zinc-900 border-zinc-800 text-amber-400">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Sliders
              </Button>
            </div>
          </div>
          <DialogDescription className="text-zinc-400 text-xs">
            Utilize AI smart tools to enhance exposure, color balance, skin tone, and dynamic contrast, or manually fine-tune with precision sliders.
          </DialogDescription>
        </DialogHeader>

        {/* AI SMART ENHANCEMENT TOOLBAR */}
        <div className="bg-zinc-900/90 border border-amber-500/40 rounded-xl p-3 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <Wand2 className="w-4 h-4 text-amber-400" />
              <span>AI Darkroom Retouch Tools (1-Click Enhancers)</span>
            </div>
            {isEnhancing && (
              <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                <Loader2 className="w-3 h-3 animate-spin" /> AI Processing...
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5">
            <button
              onClick={() => handleRunAITool('auto')}
              disabled={isEnhancing}
              className={`p-2 rounded-lg border text-left flex flex-col items-start gap-1 transition-all ${
                activeAIPreset === 'auto'
                  ? 'bg-amber-500 border-amber-300 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-amber-500/50 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Smart Auto</span>
              </div>
              <span className="text-[9px] text-zinc-400 leading-tight">Exposure & Contrast</span>
            </button>

            <button
              onClick={() => handleRunAITool('portrait_glow')}
              disabled={isEnhancing}
              className={`p-2 rounded-lg border text-left flex flex-col items-start gap-1 transition-all ${
                activeAIPreset === 'portrait_glow'
                  ? 'bg-amber-500 border-amber-300 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-amber-500/50 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Portrait Glow</span>
              </div>
              <span className="text-[9px] text-zinc-400 leading-tight">Warm Skin & Vignette</span>
            </button>

            <button
              onClick={() => handleRunAITool('landscape_pop')}
              disabled={isEnhancing}
              className={`p-2 rounded-lg border text-left flex flex-col items-start gap-1 transition-all ${
                activeAIPreset === 'landscape_pop'
                  ? 'bg-amber-500 border-amber-300 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-amber-500/50 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <Mountain className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Landscape Pop</span>
              </div>
              <span className="text-[9px] text-zinc-400 leading-tight">Sky Blue & Foliage</span>
            </button>

            <button
              onClick={() => handleRunAITool('cinema_grade')}
              disabled={isEnhancing}
              className={`p-2 rounded-lg border text-left flex flex-col items-start gap-1 transition-all ${
                activeAIPreset === 'cinema_grade'
                  ? 'bg-amber-500 border-amber-300 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-amber-500/50 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <Film className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Cinema Tone</span>
              </div>
              <span className="text-[9px] text-zinc-400 leading-tight">Teal & Orange Grade</span>
            </button>

            <button
              onClick={() => handleRunAITool('monochrome_hdr')}
              disabled={isEnhancing}
              className={`p-2 rounded-lg border text-left flex flex-col items-start gap-1 transition-all ${
                activeAIPreset === 'monochrome_hdr'
                  ? 'bg-amber-500 border-amber-300 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-amber-500/50 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <Moon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Noir B&W</span>
              </div>
              <span className="text-[9px] text-zinc-400 leading-tight">Deep B&W Curves</span>
            </button>

            <button
              onClick={() => handleRunAITool('detail_sharpen')}
              disabled={isEnhancing}
              className={`p-2 rounded-lg border text-left flex flex-col items-start gap-1 transition-all ${
                activeAIPreset === 'detail_sharpen'
                  ? 'bg-amber-500 border-amber-300 text-zinc-950 font-bold shadow-md'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:border-amber-500/50 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <Focus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Detail Sharpen</span>
              </div>
              <span className="text-[9px] text-zinc-400 leading-tight">Micro-Contrast Edge</span>
            </button>
          </div>
        </div>

        {/* Live Score Change Banner */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-white">Re-calculated Score:</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{newScore}/100</span>
          </div>
          <div className="font-mono text-xs font-semibold">
            {scoreDiff > 0 ? (
              <span className="text-amber-300">+{scoreDiff} pts Quality Gain! 📈</span>
            ) : scoreDiff < 0 ? (
              <span className="text-rose-400">{scoreDiff} pts lower</span>
            ) : (
              <span className="text-zinc-400">Unchanged</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
          {/* Live Edited Canvas Preview */}
          <div className="aspect-[4/3] bg-black border border-zinc-800 rounded-xl overflow-hidden flex items-center justify-center p-1">
            <img src={previewDataUrl} alt="Retouched shot preview" className="w-full h-full object-contain rounded-lg" />
          </div>

          {/* Controls Panel */}
          <div className="space-y-4 bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 text-xs">
            <h4 className="font-bold text-white border-b border-zinc-800 pb-2">Manual Fine-Tuning Sliders</h4>

            {/* Brightness */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> Exposure / Brightness
                </span>
                <span className="font-mono text-amber-300 font-semibold">{brightness > 0 ? `+${brightness}` : brightness}</span>
              </div>
              <Slider
                value={[brightness]}
                min={-50}
                max={50}
                step={1}
                onValueChange={([val]) => {
                  setActiveAIPreset(null);
                  setBrightness(val);
                }}
                className="cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Contrast className="w-3.5 h-3.5 text-amber-400" /> Dynamic Contrast
                </span>
                <span className="font-mono text-amber-300 font-semibold">{contrast > 0 ? `+${contrast}` : contrast}</span>
              </div>
              <Slider
                value={[contrast]}
                min={-50}
                max={50}
                step={1}
                onValueChange={([val]) => {
                  setActiveAIPreset(null);
                  setContrast(val);
                }}
                className="cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-400" /> Color Saturation
                </span>
                <span className="font-mono text-amber-300 font-semibold">{saturation > 0 ? `+${saturation}` : saturation}</span>
              </div>
              <Slider
                value={[saturation]}
                min={-50}
                max={50}
                step={1}
                onValueChange={([val]) => {
                  setActiveAIPreset(null);
                  setSaturation(val);
                }}
                className="cursor-pointer"
              />
            </div>

            {/* Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" /> Color Temp (Warm / Cool)
                </span>
                <span className="font-mono text-amber-400 font-semibold">{temperature > 0 ? `Warm +${temperature}` : temperature < 0 ? `Cool ${temperature}` : 'Neutral'}</span>
              </div>
              <Slider
                value={[temperature]}
                min={-50}
                max={50}
                step={1}
                onValueChange={([val]) => {
                  setActiveAIPreset(null);
                  setTemperature(val);
                }}
                className="cursor-pointer"
              />
            </div>

            {/* Vignette */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-400" /> Edge Vignette Darkening
                </span>
                <span className="font-mono text-amber-300 font-semibold">{vignette}%</span>
              </div>
              <Slider
                value={[vignette]}
                min={0}
                max={100}
                step={1}
                onValueChange={([val]) => {
                  setActiveAIPreset(null);
                  setVignette(val);
                }}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
          <Button onClick={onClose} variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs">
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save Retouched Photo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};