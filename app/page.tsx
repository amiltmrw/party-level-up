"use client";

import { useState, useCallback } from "react";
import { ArrowRight, ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import StepWizard from "@/components/StepWizard";
import IngredientPicker from "@/components/IngredientPicker";
import CocktailGrid from "@/components/CocktailGrid";
import CocktailDetail from "@/components/CocktailDetail";
import {
  LIQUORS,
  MIXERS,
  EXTRAS,
  TOP_LIQUORS,
  TOP_MIXERS,
  TOP_EXTRAS,
} from "@/lib/ingredients";
import type { CocktailRecipe } from "@/types";
import { getFallbackFromIngredients } from "@/lib/fallbacks";

type AppStep = 1 | 2 | 3 | "generating" | "results";

const GENERATING_MESSAGES = [
  "Consulting the master mixologist AI...",
  "Analysing your ingredient combinations...",
  "Crafting unique cocktail recipes...",
  "Generating stunning cocktail images...",
  "Almost ready to party...",
];

const STEP_META = [
  { title: "Liquors & Spirits", subtitle: "What alcohol do you have at home?" },
  { title: "Mixers & Juices", subtitle: "Sodas, juices and non-alcoholic bases." },
  { title: "Fruits, Herbs & Extras", subtitle: "Garnishes and flavour boosters." },
];

function buildImageUrl(prompt: string, seed: string): string {
  const shortened = (prompt || "cocktail").slice(0, 200);
  const encoded = encodeURIComponent(
    `${shortened}, cocktail photo, dark bar, neon lighting, photorealistic`
  );
  return `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&model=turbo&nologo=true&seed=${encodeURIComponent(seed)}`;
}

export default function HomePage() {
  const [step, setStep] = useState<AppStep>(1);
  const [selectedLiquors, setSelectedLiquors] = useState<string[]>([]);
  const [selectedMixers, setSelectedMixers] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [cocktails, setCocktails] = useState<CocktailRecipe[]>([]);
  const [selectedCocktail, setSelectedCocktail] = useState<CocktailRecipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatingMessage, setGeneratingMessage] = useState(GENERATING_MESSAGES[0]);
  const [loadingMore, setLoadingMore] = useState(false);

  const totalSelected = selectedLiquors.length + selectedMixers.length + selectedExtras.length;

  const canProceed = () => {
    if (step === 1) return selectedLiquors.length > 0;
    if (step === 2) return selectedMixers.length > 0 || selectedExtras.length > 0;
    if (step === 3) return totalSelected > 0;
    return false;
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) generateCocktails();
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const generateCocktails = async () => {
    setStep("generating");
    setError(null);
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % GENERATING_MESSAGES.length;
      setGeneratingMessage(GENERATING_MESSAGES[msgIndex]);
    }, 2500);

    try {
      const liquorNames = selectedLiquors.map((id) => LIQUORS.find((l) => l.id === id)?.name ?? id);
      const mixerNames = selectedMixers.map((id) => MIXERS.find((m) => m.id === id)?.name ?? id);
      const extraNames = selectedExtras.map((id) => EXTRAS.find((e) => e.id === id)?.name ?? id);

      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liquors: liquorNames, mixers: mixerNames, extras: extraNames }),
      });

      if (!genRes.ok) {
        const err = await genRes.json();
        const errMsg = err.error ?? "Failed to generate cocktails.";
        if (genRes.status === 429) throw new Error("quota: " + errMsg);
        throw new Error(errMsg);
      }

      const { cocktails: generatedCocktails }: { cocktails: CocktailRecipe[] } = await genRes.json();

      // Attach Pollinations image URLs directly — browser loads them natively
      const withImages = generatedCocktails.map((c) => ({
        ...c,
        imageUrl: buildImageUrl(c.imagePrompt, c.id),
        fallbackImageUrl: getFallbackFromIngredients(
          c.ingredients.map((ing) => ing.name)
        ),
      }));

      setCocktails(withImages);
      clearInterval(msgInterval);
      setStep("results");
    } catch (err) {
      clearInterval(msgInterval);
      const errMsg = err instanceof Error ? err.message : "Something went wrong.";
      if (errMsg.includes("quota") || errMsg.includes("rate") || errMsg.includes("429")) {
        setError("Rate limit reached. Please wait a moment and try again.");
      } else {
        setError(errMsg);
      }
      setStep(3);
    }
  };

  const handleStartOver = useCallback(() => {
    setStep(1);
    setSelectedLiquors([]);
    setSelectedMixers([]);
    setSelectedExtras([]);
    setCocktails([]);
    setError(null);
  }, []);

  const generateMore = async () => {
    setLoadingMore(true);
    setError(null);
    try {
      const liquorNames = selectedLiquors.map((id) => LIQUORS.find((l) => l.id === id)?.name ?? id);
      const mixerNames = selectedMixers.map((id) => MIXERS.find((m) => m.id === id)?.name ?? id);
      const extraNames = selectedExtras.map((id) => EXTRAS.find((e) => e.id === id)?.name ?? id);
      const excludeNames = cocktails.map((c) => c.name);

      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liquors: liquorNames, mixers: mixerNames, extras: extraNames, excludeNames }),
      });

      if (!genRes.ok) {
        const err = await genRes.json();
        const errMsg = err.error ?? "Failed to generate cocktails.";
        if (genRes.status === 429) throw new Error("quota: " + errMsg);
        throw new Error(errMsg);
      }

      const { cocktails: newCocktails }: { cocktails: CocktailRecipe[] } = await genRes.json();

      const withImages = newCocktails.map((c) => ({
        ...c,
        imageUrl: buildImageUrl(c.imagePrompt, c.id),
        fallbackImageUrl: getFallbackFromIngredients(
          c.ingredients.map((ing) => ing.name)
        ),
      }));

      setCocktails((prev) => [...prev, ...withImages]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong.";
      if (errMsg.includes("quota") || errMsg.includes("rate") || errMsg.includes("429")) {
        setError("Rate limit reached. Please wait a moment and try again.");
      } else {
        setError(errMsg);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const isWizardStep = step === 1 || step === 2 || step === 3;
  const stepIndex = isWizardStep ? (step as number) - 1 : 0;

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto w-full">

      {/* ── TOP HEADER ── */}
      <header className="px-5 pt-10 pb-2 text-center">
        <div className="inline-flex items-center gap-2.5">
          <span className="text-2xl">🍹</span>
          <h1 className="font-display text-2xl text-brand-text tracking-wide">
            Party <span className="text-brand-violet glow-text-violet">Level Up</span>
          </h1>
        </div>
        {isWizardStep && (
          <p className="text-brand-muted text-xs mt-2">
            Tell us what&apos;s in your bar — we&apos;ll craft tonight&apos;s cocktail menu.
          </p>
        )}
      </header>

      {/* ── STEP WIZARD ── */}
      {isWizardStep && (
        <div className="px-5 pt-5 pb-1">
          <StepWizard
            currentStep={step as number}
            counts={[selectedLiquors.length, selectedMixers.length, selectedExtras.length]}
          />
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 px-5 pb-36 mt-5">

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Step card */}
        {isWizardStep && (
          <div className="glass rounded-2xl border border-brand-border p-5">
            <div className="mb-5 pb-4 border-b border-brand-border/50">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1 h-5 rounded-full bg-brand-violet inline-block" />
                <h2 className="font-display text-xl text-brand-violet tracking-wide">
                  {STEP_META[stepIndex].title}
                </h2>
              </div>
              <p className="text-brand-muted text-xs pl-3">
                {STEP_META[stepIndex].subtitle}
              </p>
            </div>

            {step === 1 && (
              <IngredientPicker
                title="Liquors & Spirits"
                subtitle=""
                ingredients={LIQUORS}
                topIds={TOP_LIQUORS}
                selected={selectedLiquors}
                onChange={setSelectedLiquors}
                accentColor="violet"
              />
            )}
            {step === 2 && (
              <IngredientPicker
                title="Mixers & Juices"
                subtitle=""
                ingredients={MIXERS}
                topIds={TOP_MIXERS}
                selected={selectedMixers}
                onChange={setSelectedMixers}
                accentColor="cyan"
              />
            )}
            {step === 3 && (
              <IngredientPicker
                title="Fruits, Herbs & Extras"
                subtitle=""
                ingredients={EXTRAS}
                topIds={TOP_EXTRAS}
                selected={selectedExtras}
                onChange={setSelectedExtras}
                accentColor="gold"
              />
            )}
          </div>
        )}

        {/* Generating */}
        {step === "generating" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-7 text-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-brand-violet/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-brand-violet/40 animate-pulse" />
              <div className="absolute inset-4 rounded-full border-2 border-brand-violet bg-brand-violet/10 flex items-center justify-center">
                <Sparkles size={20} className="text-brand-violet" />
              </div>
            </div>
            <div>
              <p className="font-display text-base text-brand-text tracking-wide">
                {generatingMessage}
              </p>
              <p className="text-brand-muted text-xs mt-1">Groq AI is working its magic ✨</p>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
              {[...selectedLiquors, ...selectedMixers, ...selectedExtras].slice(0, 8).map((id) => {
                const ing = [...LIQUORS, ...MIXERS, ...EXTRAS].find((i) => i.id === id);
                return ing ? (
                  <span key={id} className="px-2.5 py-1 rounded-full bg-brand-surface border border-brand-border text-xs text-brand-muted">
                    {ing.emoji} {ing.name}
                  </span>
                ) : null;
              })}
              {totalSelected > 8 && (
                <span className="px-2.5 py-1 rounded-full bg-brand-surface border border-brand-border text-xs text-brand-muted">
                  +{totalSelected - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {step === "results" && cocktails.length > 0 && (
          <CocktailGrid
            cocktails={cocktails}
            onSelectCocktail={setSelectedCocktail}
            onStartOver={handleStartOver}
            onGenerateMore={generateMore}
            loadingMore={loadingMore}
          />
        )}
      </div>

      {/* ── STICKY BOTTOM NAV ── */}
      {isWizardStep && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg px-5 pb-8 pt-4 bg-gradient-to-t from-brand-bg via-brand-bg/90 to-transparent">
          <div className="flex items-center gap-3">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-violet/40 transition-all text-sm font-medium"
              >
                <ArrowLeft size={15} /> Back
              </button>
            ) : <div />}

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                step === 3
                  ? "bg-brand-violet hover:bg-brand-violet-glow text-white shadow-glow-violet"
                  : "bg-brand-violet/90 hover:bg-brand-violet text-white"
              } disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none`}
            >
              {step === 3 ? (
                <><Sparkles size={15} /> Generate Cocktails</>
              ) : (
                <>Next Step <ArrowRight size={15} /></>
              )}
            </button>
          </div>

          {step === 1 && selectedLiquors.length === 0 && (
            <p className="text-center text-[11px] text-brand-muted mt-2">Select at least one spirit to continue</p>
          )}
          {step === 2 && selectedMixers.length === 0 && (
            <p className="text-center text-[11px] text-brand-muted mt-2">You can also skip to extras</p>
          )}
        </div>
      )}

      <CocktailDetail cocktail={selectedCocktail} onClose={() => setSelectedCocktail(null)} />
    </div>
  );
}
