import React from 'react';
import { Camera, Image as ImageIcon, Upload, SwitchCamera, Award, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraShutterBarProps {
  useLiveWebcam: boolean;
  setUseLiveWebcam: (val: boolean) => void;
  onTriggerFileUpload: () => void;
  facingMode: 'user' | 'environment';
  setFacingMode: React.Dispatch<React.SetStateAction<'user' | 'environment'>>;
  onShutter: () => void;
  isCapturing: boolean;
  countdown: number | null;
  onOpenAchievements: () => void;
  onStraighten: () => void;
}

export const CameraShutterBar: React.FC<CameraShutterBarProps> = ({
  useLiveWebcam,
  setUseLiveWebcam,
  onTriggerFileUpload,
  setFacingMode,
  onShutter,
  isCapturing,
  countdown,
  onOpenAchievements,
  onStraighten,
}) => {
  return (
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

        {!useLiveWebcam && (
          <Button
            variant="outline"
            size="sm"
            onClick={onTriggerFileUpload}
            className="h-9 text-xs bg-slate-800 border-slate-700 text-purple-300 hover:text-purple-200"
          >
            <Upload className="w-3.5 h-3.5 mr-1 text-purple-400" /> Upload Image
          </Button>
        )}

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
        onClick={onShutter}
        disabled={isCapturing || countdown !== null}
        data-testid="shutter-button"
        aria-label="Capture photo"
        className="group relative w-14 h-14 rounded-full bg-slate-900 border-4 border-emerald-400 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all duration-150 disabled:opacity-50"
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
          onClick={onStraighten}
          className="h-9 text-xs bg-slate-800 border-slate-700 text-slate-300 hover:text-emerald-300"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Straighten
        </Button>
      </div>
    </div>
  );
};