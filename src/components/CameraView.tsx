import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CompositionGuideType, PhotographyMode, CapturedPhoto, CameraManualSettings, CameraRecipe } from '../types/camera';
import { CameraViewport } from './camera/CameraViewport';
import { CameraToolbar } from './camera/CameraToolbar';
import { CameraShutterBar } from './camera/CameraShutterBar';
import { ManualControls } from './ManualControls';
import { analyzeCanvasLuminance, generatePhotoScore, ImageLuminanceData } from '../utils/imageAnalysis';
import { playShutterSound, playTimerBeep } from '../utils/audio';
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [useLiveWebcam, setUseLiveWebcam] = useState<boolean>(true);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [tiltAngle, setTiltAngle] = useState<number>(0.8);
  const [showHistogram, setShowHistogram] = useState<boolean>(true);
  const [showManualTuning, setShowManualTuning] = useState<boolean>(false);

  // Self Timer State
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Focus reticle
  const [focusTarget, setFocusTarget] = useState<{ x: number; y: number } | null>(null);

  // Manual Settings
  const [manualSettings, setManualSettings] = useState<CameraManualSettings>({
    aperture: 2.8,
    whiteBalance: 5500,
    exposureEv: 0,
    iso: 200,
    filmPreset: 'standard',
    aspectRatio: '3:2',
    lightDirection: 'golden_hour',
    focalLength: 50,
    subjectDistance: 2.5,
    meteringMode: 'matrix'
  });

  const [lumData, setLumData] = useState<ImageLuminanceData>({
    histogram: new Array(256).fill(0),
    avgBrightness: 120,
    contrast: 45,
    overexposedPercent: 2,
    underexposedPercent: 3,
  });

  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const handleApplyRecipe = (recipe: CameraRecipe) => {
    setGuide(recipe.guide);
    setMode(recipe.mode);
    setManualSettings((prev) => ({
      ...prev,
      ...recipe.settings,
    }));
  };

  const getFilterCSS = useCallback(() => {
    let brightnessPct = Math.max(30, Math.min(180, 100 + manualSettings.exposureEv * 25));
    
    let wbWarmth = manualSettings.whiteBalance < 5500
      ? `sepia(${(5500 - manualSettings.whiteBalance) / 40}%)`
      : `hue-rotate(${(manualSettings.whiteBalance - 5500) / 80}deg)`;

    const blurPx = manualSettings.aperture < 2.8 ? (2.8 - manualSettings.aperture) * 1.2 : 0;

    if (manualSettings.lightDirection === 'golden_hour') {
      wbWarmth += ' sepia(25%) saturate(120%)';
    } else if (manualSettings.lightDirection === 'midday_harsh') {
      brightnessPct += 15;
    } else if (manualSettings.lightDirection === 'backlit') {
      brightnessPct -= 10;
    }

    let filmFilter = '';
    switch (manualSettings.filmPreset) {
      case 'monochrome':
        filmFilter = 'grayscale(100%) contrast(140%)';
        break;
      case 'kodachrome':
        filmFilter = 'saturate(130%) sepia(20%) contrast(115%)';
        break;
      case 'teal_orange':
        filmFilter = 'hue-rotate(-15deg) saturate(125%) contrast(110%)';
        break;
      case 'pastel_portrait':
        filmFilter = 'brightness(110%) contrast(90%) saturate(110%)';
        break;
      case 'fuji_vivid':
        filmFilter = 'saturate(160%) contrast(120%)';
        break;
      default:
        filmFilter = '';
        break;
    }

    return `brightness(${brightnessPct}%) ${wbWarmth} blur(${blurPx}px) ${filmFilter}`;
  }, [manualSettings]);

  // Webcam stream management
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

  // Orientation tilt
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null) {
        setTiltAngle(e.gamma / 3);
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // Periodic histogram analysis
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
        img.src = customImage || SAMPLE_PRACTICE_SCENES[mode];
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 640, 480);
          setLumData(analyzeCanvasLuminance(canvas));
        };
        return;
      }

      setLumData(analyzeCanvasLuminance(canvas));
    }, 300);

    return () => clearInterval(interval);
  }, [useLiveWebcam, mode, customImage, getFilterCSS]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
          setUseLiveWebcam(false);
          showSuccess('Custom image loaded into Practice Mode!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewfinderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setFocusTarget({ x, y });

    setTimeout(() => {
      setFocusTarget(null);
    }, 2000);
  };

  const executeCapture = useCallback(() => {
    setIsCapturing(true);
    playShutterSound();

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
      img.src = customImage || SAMPLE_PRACTICE_SCENES[mode];
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        finalizeCapture();
      };
    }
  }, [useLiveWebcam, customImage, guide, mode, tiltAngle, manualSettings, getFilterCSS, onPhotoCaptured]);

  const handleShutter = useCallback(() => {
    if (isCapturing || countdown !== null) return;

    if (timerDuration > 0) {
      let current = timerDuration;
      setCountdown(current);
      playTimerBeep(false);

      const interval = setInterval(() => {
        current -= 1;
        if (current > 0) {
          setCountdown(current);
          playTimerBeep(false);
        } else {
          clearInterval(interval);
          setCountdown(null);
          playTimerBeep(true);
          executeCapture();
        }
      }, 1000);
    } else {
      executeCapture();
    }
  }, [isCapturing, countdown, timerDuration, executeCapture]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center">
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Modular Viewport */}
      <CameraViewport
        videoRef={videoRef}
        useLiveWebcam={useLiveWebcam}
        customImage={customImage}
        sampleSceneUrl={SAMPLE_PRACTICE_SCENES[mode]}
        isCapturing={isCapturing}
        countdown={countdown}
        focusTarget={focusTarget}
        guide={guide}
        mode={mode}
        tiltAngle={tiltAngle}
        manualSettings={manualSettings}
        lumData={lumData}
        showHistogram={showHistogram}
        getFilterCSS={getFilterCSS}
        onViewfinderClick={handleViewfinderClick}
      />

      {/* Pro Tuning Controls Drawer */}
      {showManualTuning && (
        <div className="w-full p-3 bg-slate-950 border-t border-slate-800">
          <ManualControls
            settings={manualSettings}
            onChangeSettings={setManualSettings}
            onApplyRecipe={handleApplyRecipe}
          />
        </div>
      )}

      {/* Bottom Control Deck */}
      <div className="w-full bg-slate-900 border-t border-slate-800 p-3 md:p-4 space-y-3">
        <CameraToolbar
          mode={mode}
          setMode={setMode}
          guide={guide}
          setGuide={setGuide}
          timerDuration={timerDuration}
          setTimerDuration={setTimerDuration}
          showManualTuning={showManualTuning}
          setShowManualTuning={setShowManualTuning}
          showHistogram={showHistogram}
          setShowHistogram={setShowHistogram}
        />

        <CameraShutterBar
          useLiveWebcam={useLiveWebcam}
          setUseLiveWebcam={setUseLiveWebcam}
          onTriggerFileUpload={() => fileInputRef.current?.click()}
          facingMode={facingMode}
          setFacingMode={setFacingMode}
          onShutter={handleShutter}
          isCapturing={isCapturing}
          countdown={countdown}
          onOpenAchievements={onOpenAchievements}
          onStraighten={() => setTiltAngle(0)}
        />
      </div>
    </div>
  );
};