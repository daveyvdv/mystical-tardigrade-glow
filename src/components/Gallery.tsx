import React from 'react';
import { CapturedPhoto } from '../types/camera';
import { Trash2, ExternalLink, Camera, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryProps {
  photos: CapturedPhoto[];
  onSelectPhoto: (photo: CapturedPhoto) => void;
  onClearAll: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ photos, onSelectPhoto, onClearAll }) => {
  if (photos.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 max-w-lg mx-auto my-6 text-slate-400">
        <Camera className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-200 mb-1">No Photos Captured Yet</h3>
        <p className="text-xs text-slate-400">
          Use the camera controls above to take your first compositionally guided photo!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-slate-100">Your FrameCraft Portfolio ({photos.length})</h2>
        </div>
        <Button
          variant="outline"
          onClick={onClearAll}
          size="sm"
          className="text-xs bg-slate-800 hover:bg-rose-950 border-slate-700 text-slate-300 hover:text-rose-300"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Clear Gallery
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelectPhoto(p)}
            className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-emerald-500/60 transition-all shadow-md aspect-square flex items-center justify-center"
          >
            <img src={p.dataUrl} alt="Shot preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 opacity-80 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-slate-300 border border-white/10 capitalize">
                  {p.analysis.modeUsed}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400">
                  <Award className="w-3 h-3 text-amber-400" />
                  {p.analysis.overallScore}
                </span>
              </div>

              <div className="text-[10px] text-slate-300 font-medium flex items-center justify-between">
                <span>{new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};