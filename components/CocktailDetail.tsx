"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  Clock,
  ChefHat,
  Wine,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import type { CocktailRecipe } from "@/types";

interface CocktailDetailProps {
  cocktail: CocktailRecipe | null;
  onClose: () => void;
}

const difficultyColor = {
  Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  Medium: "text-brand-gold bg-brand-gold/10 border-brand-gold/30",
  Hard: "text-rose-400 bg-rose-400/10 border-rose-400/30",
};

export default function CocktailDetail({ cocktail, onClose }: CocktailDetailProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (cocktail) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cocktail]);

  // Reset image + scroll state when cocktail changes
  useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
    scrollRef.current?.scrollTo(0, 0);
  }, [cocktail?.id]);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!cocktail) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] glass rounded-t-3xl sm:rounded-3xl border border-brand-border overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Scrollable content — close bar is inside so sticky works */}
        <div ref={scrollRef} className="overflow-y-auto flex-1">
          {/* Sticky top bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-4 pt-3 pb-2 bg-brand-card/90 backdrop-blur-md border-b border-brand-border/50">
            <div className="flex-1 flex justify-center sm:hidden">
              <div className="w-10 h-1 rounded-full bg-brand-muted/40" />
            </div>
            <button
              onClick={onClose}
              className="absolute right-3 top-2.5 w-9 h-9 flex items-center justify-center rounded-full bg-brand-surface border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-violet/40 transition-all"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          {/* Hero image */}
          <div className="relative w-full h-56 sm:h-72 bg-brand-surface flex-shrink-0">
            {/* Shimmer while loading */}
            {(!cocktail.imageUrl || !imgLoaded) && !imgError && (
              <div className="absolute inset-0 shimmer-bg" />
            )}
            {cocktail.imageUrl && !imgError && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cocktail.imageUrl}
                alt={cocktail.name}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              />
            )}
            {imgError && cocktail.fallbackImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cocktail.fallbackImageUrl}
                alt={cocktail.name}
                className="w-full h-full object-cover"
              />
            )}
            {imgError && !cocktail.fallbackImageUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-surface to-brand-card">
                <Wine size={60} className="text-brand-violet/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/20 to-transparent" />

            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    difficultyColor[cocktail.difficulty]
                  }`}
                >
                  <ChefHat size={10} />
                  {cocktail.difficulty}
                </span>
                {cocktail.flavourProfile?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[10px] text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {cocktail.name}
              </h2>
              <p className="text-white/70 text-sm mt-1">{cocktail.tagline}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 space-y-6">
            {/* Meta row */}
            <div className="flex items-center gap-5 text-sm text-brand-muted">
              <span className="inline-flex items-center gap-1.5">
              <Clock size={14} className="text-brand-cyan" />
              {cocktail.preparationTime}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wine size={14} className="text-brand-cyan" />
                {cocktail.servingGlass}
              </span>
            </div>

            {/* Ingredients */}
            <div className="space-y-3">
              <h3 className="font-display text-lg font-semibold text-brand-text flex items-center gap-2">
                <span className="w-1 h-5 bg-brand-cyan rounded-full inline-block" />
                Ingredients
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cocktail.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-brand-surface border border-brand-border"
                  >
                    <span className="text-sm text-brand-text">{ing.name}</span>
                    <span className="text-xs font-semibold text-brand-cyan shrink-0">
                      {ing.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <h3 className="font-display text-lg font-semibold text-brand-text flex items-center gap-2">
                <span className="w-1 h-5 bg-brand-violet rounded-full inline-block" />
                How to Make It
              </h3>
              <ol className="space-y-3">
                {cocktail.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-violet/15 border border-brand-violet/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-brand-violet">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-sm text-brand-text leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Pro tip */}
            {cocktail.tips && (
              <div className="flex gap-3 p-4 rounded-xl bg-brand-gold/5 border border-brand-gold/20">
                <Lightbulb
                  size={18}
                  className="text-brand-gold shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-xs font-semibold text-brand-gold uppercase tracking-wider mb-1">
                    Pro Tip
                  </p>
                  <p className="text-sm text-brand-text/80">{cocktail.tips}</p>
                </div>
              </div>
            )}

            {/* Ready indicator */}
            <div className="flex items-center gap-2 text-emerald-400 text-sm pt-2">
              <CheckCircle2 size={16} />
              <span>You have all the ingredients for this cocktail!</span>
            </div>

            {/* Bottom close button — always accessible on mobile */}
            <button
              onClick={onClose}
              className="w-full mt-4 py-3 rounded-xl border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-violet/40 transition-all text-sm font-medium flex items-center justify-center gap-2"
            >
              <X size={15} />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
