const ALCOHOL_TO_GLASS: Record<string, string> = {
  vodka: "martini",
  gin: "martini",
  "vermouth-dry": "martini",
  whiskey: "rocks",
  bourbon: "rocks",
  scotch: "rocks",
  amaretto: "rocks",
  mezcal: "rocks",
  campari: "negroni",
  rum: "tropical",
  "peach-schnapps": "tropical",
  "blue-curacao": "blue",
  midori: "green",
  "white-rum": "mojito",
  "dark-rum": "tiki",
  "spiced-rum": "tiki",
  champagne: "flute",
  prosecco: "flute",
  "triple-sec": "coupe",
  absinthe: "green",
  "vermouth-sweet": "negroni",
  sake: "coupe",
  "wine-red": "wine",
  "wine-white": "wine",
  aperol: "spritz",
  beer: "pint",
  tequila: "margarita",
  kahlua: "coffee",
  baileys: "coffee",
  brandy: "snifter",
  cognac: "snifter",
};

// Combo patterns checked first — ingredient pairs that suggest a specific style
const COMBO_PATTERNS: [string[], string][] = [
  [["mint", "lime", "rum"], "mojito"],
  [["mint", "lime"], "mojito"],
  [["ginger beer", "vodka"], "copper"],
  [["ginger beer", "lime"], "copper"],
  [["campari", "vermouth"], "negroni"],
  [["campari", "gin"], "negroni"],
  [["aperol", "prosecco"], "spritz"],
  [["aperol"], "spritz"],
  [["blue cura"], "blue"],
  [["midori"], "green"],
  [["absinthe"], "green"],
  [["egg white"], "sour"],
  [["strawberry", "rum"], "frozen"],
  [["mango", "rum"], "frozen"],
  [["coconut", "rum"], "frozen"],
  [["pineapple", "coconut"], "frozen"],
];

const NAME_TO_GLASS: Record<string, string> = {
  vodka: "martini",
  gin: "martini",
  vermouth: "martini",
  whiskey: "rocks",
  whisky: "rocks",
  bourbon: "rocks",
  scotch: "rocks",
  rye: "rocks",
  amaretto: "rocks",
  mezcal: "rocks",
  campari: "negroni",
  rum: "tropical",
  "dark rum": "tiki",
  "spiced rum": "tiki",
  "white rum": "mojito",
  champagne: "flute",
  prosecco: "flute",
  sparkling: "flute",
  tequila: "margarita",
  "triple sec": "coupe",
  sake: "coupe",
  wine: "wine",
  aperol: "spritz",
  beer: "pint",
  kahlua: "coffee",
  baileys: "coffee",
  espresso: "coffee",
  coffee: "coffee",
  brandy: "snifter",
  cognac: "snifter",
  "blue cura": "blue",
  midori: "green",
  absinthe: "green",
  "egg white": "sour",
  mint: "mojito",
  "ginger beer": "copper",
};

const DEFAULT_GLASS = "coupe";

export function getFallbackImage(selectedAlcoholIds: string[]): string {
  for (const id of selectedAlcoholIds) {
    const glass = ALCOHOL_TO_GLASS[id];
    if (glass) return `/fallbacks/${glass}.webp`;
  }
  return `/fallbacks/${DEFAULT_GLASS}.webp`;
}

export function getFallbackFromIngredients(ingredientNames: string[]): string {
  const lower = ingredientNames.map((n) => n.toLowerCase());
  const joined = lower.join(" ");

  // Check combo patterns first for more specific matches
  for (const [keywords, glass] of COMBO_PATTERNS) {
    if (keywords.every((kw) => joined.includes(kw))) {
      return `/fallbacks/${glass}.webp`;
    }
  }

  // Fall back to single-ingredient matching
  for (const name of lower) {
    for (const [key, glass] of Object.entries(NAME_TO_GLASS)) {
      if (name.includes(key)) return `/fallbacks/${glass}.webp`;
    }
  }
  return `/fallbacks/${DEFAULT_GLASS}.webp`;
}
