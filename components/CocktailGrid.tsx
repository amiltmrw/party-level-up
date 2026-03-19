"use client";

import { RefreshCw } from "lucide-react";
import CocktailCard from "./CocktailCard";
import type { CocktailRecipe } from "@/types";

interface CocktailGridProps {
  cocktails: CocktailRecipe[];
  onSelectCocktail: (cocktail: CocktailRecipe) => void;
  onStartOver: () => void;
}

export default function CocktailGrid({
  cocktails,
  onSelectCocktail,
  onStartOver,
}: CocktailGridProps) {
  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-violet/10 border border-brand-violet/30 text-brand-violet text-xs font-medium uppercase tracking-wider">
          ✨ Your cocktail menu is ready
        </div>
        <h2 className="font-display text-3xl font-bold text-brand-text glow-text-violet">
          {cocktails.length} Cocktails Crafted
        </h2>
        <p className="text-brand-muted text-sm max-w-md mx-auto">
          Tap any cocktail to see the full recipe, step-by-step instructions, and
          pro tips.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cocktails.map((cocktail) => (
          <CocktailCard
            key={cocktail.id}
            cocktail={cocktail}
            onClick={onSelectCocktail}
          />
        ))}
      </div>

      {/* Start over */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onStartOver}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-violet/40 transition-all duration-200 text-sm font-medium"
        >
          <RefreshCw size={15} />
          Start with different ingredients
        </button>
      </div>
    </div>
  );
}
