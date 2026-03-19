"use client";

import { useState, useMemo } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import type { Ingredient } from "@/types";

interface IngredientPickerProps {
  title: string;
  subtitle: string;
  ingredients: Ingredient[];
  topIds: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  accentColor?: "violet" | "cyan" | "gold";
}

const accent = {
  violet: {
    heading: "text-brand-violet",
    chip: "bg-brand-violet/20 border-brand-violet/60 text-violet-200",
    count: "bg-brand-violet text-white",
    searchFocus: "focus:border-brand-violet/50",
    expandBtn: "text-brand-violet hover:text-violet-300",
  },
  cyan: {
    heading: "text-brand-cyan",
    chip: "bg-brand-cyan/20 border-brand-cyan/60 text-cyan-200",
    count: "bg-brand-cyan text-brand-bg",
    searchFocus: "focus:border-brand-cyan/50",
    expandBtn: "text-brand-cyan hover:text-cyan-300",
  },
  gold: {
    heading: "text-brand-gold",
    chip: "bg-brand-gold/20 border-brand-gold/60 text-yellow-200",
    count: "bg-brand-gold text-brand-bg",
    searchFocus: "focus:border-brand-gold/50",
    expandBtn: "text-brand-gold hover:text-yellow-300",
  },
};

export default function IngredientPicker({
  title,
  subtitle,
  ingredients,
  topIds,
  selected,
  onChange,
  accentColor = "violet",
}: IngredientPickerProps) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const style = accent[accentColor];

  const topIngredients = useMemo(
    () => ingredients.filter((i) => topIds.includes(i.id)),
    [ingredients, topIds]
  );

  const otherIngredients = useMemo(
    () => ingredients.filter((i) => !topIds.includes(i.id)),
    [ingredients, topIds]
  );

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ingredients.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.category?.toLowerCase().includes(q)
    );
  }, [ingredients, query]);

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  };

  const isSearching = query.trim().length > 0;

  const Chip = ({ ing }: { ing: Ingredient }) => {
    const isSelected = selected.includes(ing.id);
    return (
      <button
        onClick={() => toggle(ing.id)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all duration-150 ${
          isSelected
            ? `${style.chip} font-medium`
            : "bg-brand-surface border-brand-border text-brand-muted hover:border-brand-border hover:text-brand-text"
        }`}
      >
        <span>{ing.emoji}</span>
        <span>{ing.name}</span>
        {isSelected && <X size={11} className="ml-0.5 opacity-70" />}
      </button>
    );
  };

  return (
    <div className="w-full space-y-5">
      {/* Selected count badge (inline with search) */}

      {/* Search */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none"
        />
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full bg-brand-surface border border-brand-border rounded-xl pl-10 pr-9 py-2.5 text-base sm:text-sm text-brand-text placeholder:text-brand-muted outline-none transition-colors ${style.searchFocus}`}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Search results */}
      {isSearching && (
        <div className="flex flex-wrap gap-2">
          {searchResults.length === 0 ? (
            <p className="text-brand-muted text-sm py-2">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            searchResults.map((ing) => <Chip key={ing.id} ing={ing} />)
          )}
        </div>
      )}

      {/* Popular picks */}
      {!isSearching && (
        <>
          <div className="space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-brand-muted">
              Popular picks
            </p>
            <div className="flex flex-wrap gap-2">
              {topIngredients.map((ing) => (
                <Chip key={ing.id} ing={ing} />
              ))}
            </div>
          </div>

          {/* View all toggle */}
          <div>
            <button
              onClick={() => setExpanded((v) => !v)}
              className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${style.expandBtn}`}
            >
              {expanded ? (
                <>
                  <ChevronUp size={15} /> Show less
                </>
              ) : (
                <>
                  <ChevronDown size={15} /> View all ({otherIngredients.length} more)
                </>
              )}
            </button>

            {expanded && (
              <div className="mt-3 flex flex-wrap gap-2">
                {otherIngredients.map((ing) => (
                  <Chip key={ing.id} ing={ing} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
