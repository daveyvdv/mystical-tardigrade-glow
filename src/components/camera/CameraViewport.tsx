import React from 'react';
import { CompositionGuideType, PhotographyMode, CameraManualSettings } from '../../types/camera';
import { CompositionGuides } from '../CompositionGuides';
import { LightingHistogram } from '../LightingHistogram';
import { CoachOverlay } from '../CoachOverlay';
import { AspectRatioMask } from '../AspectRatioMask';
import { ImageLuminanceData } from '../../utils/imageAnalysis';
import { Focus } from 'lucide-react';

interface CameraViewportProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  useLiveWebcam: boolean;
  customImage: string | null;
  sampleSceneUrl: string;
  isCapturing: boolean;
  countdown: number | null;
  focusTarget: { x: number; y: number } | null;
  guide: CompositionGuideType;
  mode: PhotographyMode;
  tiltAngle: number;
  manualSettings: CameraManualSettings;
  lumData: ImageLuminanceData;
  showHistogram: boolean;
  getFilterCSS: () => string;
  onViewfinderClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const CameraViewport: React.FC<CameraViewportProps> = ({
  videoRef,
  useLiveWebcam,
  customImage,
  sampleSceneUrl,
  isCapturing,
  countdown,
  focusTarget,
  guide,
  mode,
  tiltAngle,
  manualSettings,
  lumData,
  showHistogram,
  getFilterCSS,
  onViewfinderClick,
}) => {
  // Focal length zoom scale factor relative to 50mm baseline
  const focalScale = Math.max(0.75, Math.min(2.5, 1 + (manualSettings.focalLength - 50) / 120));

  return (
    <div
      onClick={onViewfinderClick}
      className="relative w-full aspect-[4/3] max-h-[70vh] bg-black flex items-center justify-center overflow-hidden cursor-crosshair select-none"
    >
      {/* Flash effect on capture */}
      {isCapturing && <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-300" />}

      {/* Self-Timer Countdown Overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="text-7xl md:text-9xl font-black text-amber-400 font-mono animate-bounce drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]">
            {countdown}
          </div>
        </div>
      )}

      {useLiveWebcam ? (
        <video
          ref={videoRef}
          playsInline
          muted
          className="w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{
            filter: getFilterCSS(),
            transform: `scale(${focalScale})`,
          }}
        />
      ) : (
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={customImage || sampleSceneUrl}
            alt="Practice scene"
            className="w-full h-full object-cover transition-transform duration-300 ease-out"
            style={{
              filter: getFilterCSS(),
              transform: `scale(${focalScale})`,
            }}
          />
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-amber-300 font-medium border border-amber-500/30 z-20">
            {customImage ? 'Custom Practice Image' : 'Practice Scene Mode'}
          </div>
        </div>
      )}

      {/* Tap To Focus Target Reticle Overlay */}
      {focusTarget && (
        <div
          className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-amber-400 rounded-full flex items-center justify-center animate-ping"
          style={{ left: `${focusTarget.x}%`, top: `${focusTarget.y}%` }}
        >
          <Focus className="w-6 h-6 text-amber-400" />
        </div>
      )}

      {/* Aspect Ratio Letterbox Overlay */}
      <AspectRatioMask aspectRatio={manualSettings.aspectRatio} />

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

      {/* Focal length indicator overlay badge */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto z-20 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded border border-cyan-500/40 font-mono text-[11px] text-cyan-300 font-semibold shadow-lg">
        Lens: {manualSettings.focalLength}mm
      </div>

      {/* Histogram Overlay */}
      {showHistogram && (
        <div className="absolute bottom-4 right-4 z-20 hidden sm:block">
          <LightingHistogram data={lumData} />
        </div>
      )}
    </div>
  );
};