import React from 'react';
import { AspectRatioType } from '../types/camera';

interface AspectRatioMaskProps {
  aspectRatio: AspectRatioType;
}

export const AspectRatioMask: React.FC<AspectRatioMaskProps> = ({ aspectRatio }) => {
  if (aspectRatio === '3:2') return null; // Default camera container format

  return (
    <div className="absolute inset-0 pointer-events-none z-15 flex flex-col items-center justify-center">
      {/* 1:1 Square Mask */}
      {aspectRatio === '1:1' && (
        <div className="w-full h-full flex flex-col justify-between">
          <div className="w-full bg-black/80 backdrop-blur-[1px] transition-all h-[12.5%]" />
          <div className="w-full border-y border-amber-400/60 text-[10px] text-amber-300 font-mono px-2 py-0.5 bg-black/30 flex justify-between">
            <span>1:1 Square Format</span>
            <span>Instagram / Social Framing</span>
          </div>
          <div className="w-full bg-black/80 backdrop-blur-[1px] transition-all h-[12.5%]" />
        </div>
      )}

      {/* 4:5 Social Portrait Mask */}
      {aspectRatio === '4:5' && (
        <div className="w-full h-full flex justify-between">
          <div className="h-full bg-black/80 backdrop-blur-[1px] transition-all w-[10%]" />
          <div className="flex-1 flex flex-col justify-between border-x border-amber-400/60 p-2">
            <span className="text-[10px] text-amber-300 font-mono bg-black/40 px-1.5 py-0.5 rounded self-start">4:5 Vertical Portrait</span>
          </div>
          <div className="h-full bg-black/80 backdrop-blur-[1px] transition-all w-[10%]" />
        </div>
      )}

      {/* 16:9 Widescreen Cinema Mask */}
      {aspectRatio === '16:9' && (
        <div className="w-full h-full flex flex-col justify-between">
          <div className="w-full bg-black/85 backdrop-blur-[1px] transition-all h-[14%]" />
          <div className="w-full border-y border-amber-400/60 text-[10px] text-amber-300 font-mono px-2 py-0.5 bg-black/30 flex justify-between">
            <span>16:9 HD Widescreen</span>
            <span>Landscape Video & TV</span>
          </div>
          <div className="w-full bg-black/85 backdrop-blur-[1px] transition-all h-[14%]" />
        </div>
      )}

      {/* 2.39:1 Anamorphic Cinematic Letterbox */}
      {aspectRatio === '2.39:1' && (
        <div className="w-full h-full flex flex-col justify-between">
          <div className="w-full bg-black/90 backdrop-blur-[1px] transition-all h-[22%]" />
          <div className="w-full border-y border-amber-400/70 text-[10px] text-amber-300 font-mono px-2 py-0.5 bg-black/40 flex justify-between">
            <span>2.39:1 Anamorphic Cinema Scope</span>
            <span>Cinematic Film Format</span>
          </div>
          <div className="w-full bg-black/90 backdrop-blur-[1px] transition-all h-[22%]" />
        </div>
      )}
    </div>
  );
};