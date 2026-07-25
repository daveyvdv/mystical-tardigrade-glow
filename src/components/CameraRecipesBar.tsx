import React from 'react';
import { CAMERA_RECIPES } from '../data/cameraRecipes';
import { CameraRecipe, CameraManualSettings, CompositionGuideType, PhotographyMode } from '../types/camera';
import { Sparkles } from 'lucide-react';
import { showSuccess } from '../utils/toast';

interface CameraRecipesBarProps {
  currentSettings: CameraManualSettings;
  onApplyRecipe: (recipe: CameraRecipe) => void;
}

export const CameraRecipesBar: React.FC<CameraRecipesBarProps> = ({ currentSettings, onApplyRecipe }) => {
  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 space-y-2">
      <div className="flex items-center gap-1.5 font-semibold text-amber-300 text-[11px]">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Instant Pro Camera Recipes (1-Click Presets)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {CAMERA_RECIPES.map((recipe) => (
          <button
            key={recipe.id}
            onClick={() => {
              onApplyRecipe(recipe);
              showSuccess(`Applied "${recipe.name}" recipe!`);
            }}
            className="group flex flex-col items-start p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all text-left"
          >
            <div className="flex items-center gap-1.5 font-bold text-slate-100 text-[11px] mb-0.5">
              <span>{recipe.icon}</span>
              <span className="truncate group-hover:text-amber-300">{recipe.name}</span>
            </div>
            <p className="text-[9px] text-slate-400 line-clamp-2 leading-tight">
              {recipe.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};