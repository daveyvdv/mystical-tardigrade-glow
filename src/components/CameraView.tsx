import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CompositionGuideType, PhotographyMode, CapturedPhoto, CameraManualSettings } from '../types/camera';
import { CompositionGuides } from './CompositionGuides';
import { LightingHistogram } from './LightingHistogram';
import { CoachOverlay } from './CoachOverlay';
import { ManualControls } from './ManualControls';
import { analyzeCanvasLuminance, generatePhotoScore, ImageLuminanceData } from '../utils/imageAnalysis';
import {
  Camera,
  Sun,
  RotateCcw,
  BookOpen,
  Image as ImageIcon,
  Sliders,
  SwitchCamera,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showError, showSuccess } from '../utils/toast';

interface CameraViewProps {
  guide: CompositionGuideType;
  setGuide: (guide: CompositionGuideType) => void;
  mode: PhotographyMode;
  setMode: (mode: PhotographyMode) => void;
  onPhotoCaptured: (photo: CapturedPhoto) => void;
  onOpenAcademy: () => void;
  onOpenAchievements: () => void;
}

const SAMPLE_PRACTICE_SCENES: Record<PhotographyMode, string> = {
  portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
  landscape: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
  architecture: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  macro: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  street: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=1200&q=80'
};

export const CameraView: React.FC<CameraViewProps> = ({
  guide,
  setGuide,
  mode,
  setMode,
  onPhotoCaptured,
  onOpenAcademy,
  onOpenAchievements,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [useLiveWebcam, setUseLiveWebcam] = useState<boolean>(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [tiltAngle, setTiltAngle] = useState<number>(0.8);
  const [showHistogram, setShowHistogram] = useState<boolean>(true);
  const [showManualTuning, setShowManualTuning] = useState<boolean>(false);

  // Manual Controls State
  const [manualSettings, setManualSettings] = useState<CameraManualSettings>({
    aperture: 2.8,
    whiteBalance: 5500,
    exposureEv: 0,
    iso: 200,
  });

  const [lumData, setLumData] = useState<ImageLuminanceData>({
    histogram: new Array(256).fill(0),
    avgBrightness: 120,
    contrast: 45,
    overexposedPercent: 2,
    underexposedPercent: 3,
  });

  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  // Helper filter generator for Canvas / Video styles
  const getFilterCSS = useCallback(() => {
    // EV brightness factor: -2 EV (50%) to +2 EV (150%)
    const brightnessPct = Math.max(30, Math.min(180, 100 + manualSettings.exposureEv * 25));
    // WB temperature warmth tint: 2700K (warm sepia/hue) to 8000K (cool hue)
    const wbWarmth = manualSettings.whiteBalance < 5500
      ? `sepia(${(5500 - manualSettings.whiteBalance) / 40}%)`
      : `hue-rotate(${(manualSettings.whiteBalance - 5500) / 80}deg)`;
    // Aperture blur effect: low f-number (f/1.4 = 1.5px blur simulation)
    const blurPx = manualSettings.aperture < 2.8 ? (2.8 - manualSettings.aperture) * 1.2 : 0;

    return `brightness(${brightnessPct}%) ${wbWarmth} blur(${blurPx}px)`;
  }, [manualSettings]);

  // Web camera initialization
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (useLiveWebcam) {
      navigator.mediaDevices
        ?.getUserMedia({
          video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.warn('Camera access error:', err);
          setUseLiveWebcam(false);
          showError('Webcam unavailable. Switch to Practice Scene mode!');
        });
    }

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [useLiveWebcam, facingMode]);

  // Device orientation tilt sensor
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null) {
        setTiltAngle(e.gamma / 3);
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Periodic sampling for histogram
  useEffect(() => {
    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 640;
      canvas.height = 480;

      ctx.filter = getFilterCSS();

      if (useLiveWebcam && videoRef.current && videoRef.current.readyState === 4) {
        ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = SAMPLE_PRACTICE_SCENES[mode];
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 640, 480);
          setLumData(analyzeCanvasLuminance(canvas));
        };
        return;
      }

      setLumData(analyzeCanvasLuminance(canvas));
    }, 300);

    return () => clearInterval(interval);
  }, [useLiveWebcam, mode, getFilterCSS]);

  // Handle Shutter Capture
  const handleShutter = useCallback(() => {
    setIsCapturing(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 960;
    ctx.filter = getFilterCSS();

    const finalizeCapture = () => {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const liveData = analyzeCanvasLuminance(canvas);
      const scoreAnalysis = generatePhotoScore(liveData, guide, mode, tiltAngle);

      const photo: CapturedPhoto = {
        id: Date.now().toString(),
        dataUrl,
        timestamp: new Date(),
        analysis: scoreAnalysis,
        manualSettings,
      };

      setTimeout(() => {
        setIsCapturing(false);
        onPhotoCaptured(photo);
        showSuccess('Photo captured & analyzed!');
      }, 200);
    };

    if (useLiveWebcam && videoRef.current && videoRef.current.readyState === 4) {
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      finalizeCapture();
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = SAMPLE_PRACTICE_SCENES[mode];
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        finalizeCapture();
      };
    }
  }, [useLiveWebcam, guide, mode, tiltAngle, manualSettings, getFilterCSS, onPhotoCaptured]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center">
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Viewport */}
      <div className="relative w-full aspect-[4/3] max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
        {isCapturing && <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-300" />}

        {useLiveWebcam ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover transition-all duration-150"
            style={{ filter: getFilterCSS() }}
          />
        ) : (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={SAMPLE_PRACTICE_SCENES[mode]}
              alt="Practice scene"
              className="w-full h-full object-cover transition-all duration-150"
              style={{ filter: getFilterCSS() }}
            />
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-amber-300 font-medium border border-amber-500/30">
              Practice Scene Mode
            </div>
          </div>
        )}

        {/* Composition HUD Overlays */}
        <CompositionGuides guide={guide} tiltAngle={tiltAngle} />

        {/* Photog Coaching Headers */}
        <CoachOverlay
          mode={mode}
          guide={guide}
          tiltAngle={tiltAngle}
          avgBrightness={lumData.avgBrightness}
          overexposedPercent={lumData.overexposedPercent}
        />

        {/* Histogram Overlay */}
        {showHistogram && (
          <div className="absolute bottom-4 right-4 z-20 hidden sm:block">
            <LightingHistogram data={lumData} />
          </div>
        )}
      </div>

      {/* Manual Controls Sliding Drawer */}
      {showManualTuning && (
        <div className="w-full p-3 bg-slate-950 border-t border-slate-800">
          <ManualControls settings={manualSettings} onChangeSettings={setManualSettings} />
        </div>
      )}

      {/* Camera Control Panel */}
      <div className="w-full bg-slate-900 border-t border-slate-800 p-3 md:p-4 space-y-3">
        {/* Row 1: Mode Selectors & Overlays */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Mode:</span>
            <Select value={mode} onValueChange={(val) => setMode(val as PhotographyMode)}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-slate-100 text-xs h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                <SelectItem value="portrait">👤 Portrait</SelectItem>
                <SelectItem value="landscape">🌄 Landscape</SelectItem>
                <SelectItem value="architecture">🏛️ Architecture</SelectItem>
                <SelectItem value="macro">🔍 Macro / Still</SelectItem>
                <SelectItem value="street">🏙️ Street</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Composition Guide Toggle Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Grid:</span>
            <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setGuide('thirds')}
                className={`px-2 py-1 rounded-md transition-colors ${guide === 'thirds' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300'}`}
              >
                Thirds
              </button>
              <button
                onClick={() => setGuide('golden_spiral')}
                className={`px-2 py-1 rounded-md transition-colors ${guide === 'golden_spiral' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300'}`}
              >
                Spiral
              </button>
              <button
                onClick={() => setGuide('leading_lines')}
                className={`px-2 py-1 rounded-md transition-colors ${guide === 'leading_lines' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300'}`}
              >
                Lines
              </button>
              <button
                onClick={() => setGuide('center')}
                className={`px-2 py-1 rounded-md transition-colors ${guide === 'center' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300'}`}
              >
                Center
              </button>
              <button
                onClick={() => setGuide('framing')}
                className={`px-2 py-1 rounded-md transition-colors ${guide === 'framing' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300'}`}
              >
                Frame
              </button>
            </div>
          </div>

          {/* Quick Tools */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowManualTuning(!showManualTuning)}
              className={`h-8 text-xs border-slate-700 ${
                showManualTuning ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 mr-1" />
              Pro Tuning
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistogram(!showHistogram)}
              className={`h-8 text-xs border-slate-700 ${
                showHistogram ? 'bg-amber-950/60 border-amber-500/40 text-amber-300' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <Sun className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Histogram
            </Button>
          </div>
        </div>

        {/* Row 2: Shutter Button & Toggles */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseLiveWebcam(!useLiveWebcam)}
              className="h-9 text-xs bg-slate-800 border-slate-700 text-slate-200"
            >
              {useLiveWebcam ? (
                <>
                  <Camera className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Live WebCam
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5 mr-1 text-amber-400" /> Practice Scene
                </>
              )}
            </Button>

            {useLiveWebcam && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
                className="h-9 w-9 p-0 bg-slate-800 border-slate-700 text-slate-300"
              >
                <SwitchCamera className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* MAIN SHUTTER BUTTON */}
          <button
            onClick={handleShutter}
            disabled={isCapturing}
            className="group relative w-14 h-14 rounded-full bg-slate-900 border-4 border-emerald-400 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all duration-150"
          >
            <div className="w-full h-full rounded-full bg-emerald-500 group-hover:bg-emerald-400 transition-colors flex items-center justify-center">
              <Camera className="w-6 h-6 text-slate-950" />
            </div>
          </button>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAchievements}
              className="h-9 text-xs bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700"
            >
              <Award className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Badges
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setTiltAngle(0)}
              className="h-9 text-xs bg-slate-800 border-slate-700 text-slate-300 hover:text-emerald-300"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Straighten
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};