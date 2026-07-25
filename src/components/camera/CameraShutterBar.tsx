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
          className="h-9 text-xs bg-zinc-900 border-amber-500/30 text-white hover:bg-zinc-800"
        >
          {useLiveWebcam ? (
            <>
              <Camera className="w-3.5 h-3.5 mr-1 text-amber-400" /> Live WebCam
            </>
          ) : (
            <>
              <ImageIcon className="w-3.5 h-3.5 mr-1 text-amber-300" /> Practice Scene
            </>
          )}
        </Button>

        {!useLiveWebcam && (
          <Button
            variant="outline"
            size="sm"
            onClick={onTriggerFileUpload}
            className="h-9 text-xs bg-zinc-900 border-amber-500/30 text-amber-300 hover:text-white"
          >
            <Upload className="w-3.5 h-3.5 mr-1 text-amber-400" /> Upload Image
          </Button>
        )}

        {useLiveWebcam && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
            className="h-9 w-9 p-0 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
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
        className="group relative w-14 h-14 rounded-full bg-zinc-950 border-4 border-amber-400 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all duration-150 disabled:opacity-50"
      >
        <div className="w-full h-full rounded-full bg-amber-400 group-hover:bg-amber-300 transition-colors flex items-center justify-center">
          <Camera className="w-6 h-6 text-zinc-950" />
        </div>
      </button>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAchievements}
          className="h-9 text-xs bg-zinc-900 border-amber-500/30 text-amber-300 hover:bg-zinc-800 hover:text-white"
        >
          <Award className="w-3.5 h-3.5 mr-1 text-amber-400" />
          Badges
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onStraighten}
          className="h-9 text-xs bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Straighten
        </Button>
      </div>
    </div>
  );
};