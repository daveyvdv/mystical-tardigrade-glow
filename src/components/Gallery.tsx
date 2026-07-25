import React, { useState, useMemo } from 'react';
import { CapturedPhoto } from '../types/camera';
import { Trash2, ExternalLink, Camera, Award, Sparkles, Sliders, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GalleryProps {
  photos: CapturedPhoto[];
  onSelectPhoto: (photo: CapturedPhoto) => void;
  onClearAll: () => void;
  onComparePhotos: (photoA: CapturedPhoto, photoB: CapturedPhoto) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ photos, onSelectPhoto, onClearAll, onComparePhotos }) => {
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      const textMatch =
        !searchQuery ||
        p.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.analysis.guideUsed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.analysis.modeUsed.toLowerCase().includes(searchQuery.toLowerCase());

      const modeMatch = modeFilter === 'all' || p.analysis.modeUsed === modeFilter;

      let scoreMatch = true;
      if (scoreFilter === 'high') scoreMatch = p.analysis.overallScore >= 80;
      if (scoreFilter === 'medium') scoreMatch = p.analysis.overallScore >= 60 && p.analysis.overallScore < 80;
      if (scoreFilter === 'needs_work') scoreMatch = p.analysis.overallScore < 60;

      return textMatch && modeMatch && scoreMatch;
    });
  }, [photos, searchQuery, modeFilter, scoreFilter]);

  if (photos.length === 0) {
    return (
      <div className="p-8 text-center bg-zinc-950/60 rounded-2xl border border-zinc-800 max-w-lg mx-auto my-6 text-zinc-400">
        <Camera className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white mb-1">No Photos Captured Yet</h3>
        <p className="text-xs text-zinc-400">
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
          <h2 className="text-lg font-bold text-white">Your FrameCraft Portfolio ({photos.length})</h2>
        </div>

        <div className="flex items-center gap-2">
          {selectedForCompare.length === 2 && (
            <Button
              onClick={handleStartComparison}
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
            >
              <Sliders className="w-3.5 h-3.5 mr-1" />
              Compare Selected (2)
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onClearAll}
            size="sm"
            className="text-xs bg-zinc-900 hover:bg-rose-950 border-zinc-800 text-zinc-300 hover:text-rose-300"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes or guides..."
            className="pl-8 bg-zinc-900 border-zinc-800 text-xs h-8 text-white focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-400 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Mode:
          </span>
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-xs text-white"
          >
            <option value="all">All Modes</option>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
            <option value="architecture">Architecture</option>
            <option value="macro">Macro</option>
            <option value="street">Street</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-400">Score:</span>
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-xs text-white"
          >
            <option value="all">All Ratings</option>
            <option value="high">High (80+)</option>
            <option value="medium">Medium (60-79)</option>
            <option value="needs_work">{"Needs Work (<60)"}</option>
          </select>
        </div>
      </div>

      {filteredPhotos.length === 0 ? (
        <div className="text-center py-6 text-zinc-500 text-xs italic">
          No photos match your active search or filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredPhotos.map((p) => {
            const isSelected = selectedForCompare.includes(p.id);

            return (
              <div
                key={p.id}
                onClick={() => onSelectPhoto(p)}
                className={`group relative bg-zinc-950 border rounded-xl overflow-hidden cursor-pointer transition-all shadow-md aspect-square flex items-center justify-center ${
                  isSelected ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-zinc-800 hover:border-amber-500/60'
                }`}
              >
                <img src={p.dataUrl} alt="Shot preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-black/30 opacity-80 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-zinc-300 border border-white/10 capitalize">
                      {p.analysis.modeUsed}
                    </span>
                    
                    <button
                      onClick={(e) => toggleCompare(e, p.id)}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-zinc-950 border-amber-300 font-bold'
                          : 'bg-zinc-900/90 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                      }`}
                    >
                      {isSelected ? '✓ Selected' : 'Compare'}
                    </button>
                  </div>

                  <div className="text-[10px] text-zinc-300 font-medium flex items-center justify-between">
                    <span className="flex items-center gap-1 font-mono font-bold text-amber-300 bg-black/60 px-1.5 py-0.5 rounded">
                      <Award className="w-3 h-3 text-amber-400" />
                      {p.analysis.overallScore}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};