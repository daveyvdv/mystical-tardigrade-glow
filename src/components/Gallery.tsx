import React, { useState } from 'react';
import { CapturedPhoto } from '../types/camera';
import { Trash2, ExternalLink, Camera, Award, Sparkles, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryProps {
  photos: CapturedPhoto[];
  onSelectPhoto: (photo: CapturedPhoto) => void;
  onClearAll: () => void;
  onComparePhotos: (photoA: CapturedPhoto, photoB: CapturedPhoto) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ photos, onSelectPhoto, onClearAll, onComparePhotos }) => {
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

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

  const toggleCompare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((item) => item !== id));
    } else {
      if (selectedForCompare.length >= 2) {
        setSelectedForCompare([selectedForCompare[1], id]);
      } else {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  const handleStartComparison = () => {
    if (selectedForCompare.length === 2) {
      const photoA = photos.find((p) => p.id === selectedForCompare[0]);
      const photoB = photos.find((p) => p.id === selectedForCompare[1]);
      if (photoA && photoB) {
        onComparePhotos(photoA, photoB);
      }
    }
  };

  return (
    <div className="space-y-4 my-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-slate-100">Your FrameCraft Portfolio ({photos.length})</h2>
        </div>

        <div className="flex items-center gap-2">
          {selectedForCompare.length === 2 && (
            <Button
              onClick={handleStartComparison}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
            >
              <Sliders className="w-3.5 h-3.5 mr-1" />
              Compare Selected (2)
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onClearAll}
            size="sm"
            className="text-xs bg-slate-800 hover:bg-rose-950 border-slate-700 text-slate-300 hover:text-rose-300"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {photos.length >= 2 && selectedForCompare.length < 2 && (
        <p className="text-xs text-slate-400 italic">
          Tip: Click "Compare" on two photos to compare their composition scores side-by-side.
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((p) => {
          const isSelected = selectedForCompare.includes(p.id);

          return (
            <div
              key={p.id}
              onClick={() => onSelectPhoto(p)}
              className={`group relative bg-slate-900 border rounded-xl overflow-hidden cursor-pointer transition-all shadow-md aspect-square flex items-center justify-center ${
                isSelected ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-800 hover:border-emerald-500/60'
              }`}
            >
              <img src={p.dataUrl} alt="Shot preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 opacity-80 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-slate-300 border border-white/10 capitalize">
                    {p.analysis.modeUsed}
                  </span>
                  
                  <button
                    onClick={(e) => toggleCompare(e, p.id)}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                        : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : 'Compare'}
                  </button>
                </div>

                <div className="text-[10px] text-slate-300 font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1 font-mono font-bold text-emerald-400 bg-black/60 px-1.5 py-0.5 rounded">
                    <Award className="w-3 h-3 text-amber-400" />
                    {p.analysis.overallScore}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};