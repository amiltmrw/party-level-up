"use client";

import { useState } from "react";
import { Clock, ChefHat } from "lucide-react";
import type { CocktailRecipe } from "@/types";

interface CocktailCardProps {
  cocktail: CocktailRecipe;
  onClick: (cocktail: CocktailRecipe) => void;
}

const difficultyColor = {
  Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Medium: "text-brand-gold bg-brand-gold/10 border-brand-gold/30",
  Hard: "text-rose-400 bg-rose-400/10 border-rose-400/30",
};

export default function CocktailCard({ cocktail, onClick }: CocktailCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={() => onClick(cocktail)}
      className="group w-full text-left glass rounded-2xl overflow-hidden border border-brand-border hover:border-brand-violet/40 transition-all duration-300 hover:shadow-glow-violet hover:-translate-y-1"
    >
      {/* Image area */}
      <div className="relative w-full aspect-square overflow-hidden bg-brand-surface">

        {/* Shimmer skeleton — shown until image loads */}
        {(!cocktail.imageUrl || !loaded) && !imgError && (
          <div className="absolute inset-0 shimmer-bg" />
        )}

        {/* Actual image */}
        {cocktail.imageUrl && !imgError && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cocktail.imageUrl}
            alt={cocktail.name}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Difficulty badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${
              difficultyColor[cocktail.difficulty]
            }`}
          >
            <ChefHat size={10} />
            {cocktail.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-display text-base font-semibold text-brand-text group-hover:text-brand-violet transition-colors line-clamp-1">
          {cocktail.name}
        </h3>
        <p className="text-brand-muted text-xs line-clamp-2 leading-relaxed">
          {cocktail.tagline}
        </p>
        <div className="flex items-center gap-3 pt-1">
          <span className="inline-flex items-center gap-1 text-xs text-brand-muted">
            <Clock size={11} />
            {cocktail.preparationTime}
          </span>
          <span className="text-brand-border">·</span>
          <span className="text-xs text-brand-muted">{cocktail.servingGlass}</span>
        </div>
        {cocktail.flavourProfile?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {cocktail.flavourProfile.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-brand-surface border border-brand-border text-[10px] text-brand-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
