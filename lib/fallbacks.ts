const ALCOHOL_TO_GLASS: Record<string, string> = {
  vodka: "martini",
  gin: "martini",
  "vermouth-dry": "martini",
  whiskey: "rocks",
  bourbon: "rocks",
  scotch: "rocks",
  amaretto: "rocks",
  mezcal: "rocks",
  campari: "rocks",
  rum: "tropical",
  "dark-rum": "tropical",
  "spiced-rum": "tropical",
  "white-rum": "tropical",
  "peach-schnapps": "tropical",
  "blue-curacao": "tropical",
  midori: "tropical",
  champagne: "flute",
  prosecco: "flute",
  "triple-sec": "coupe",
  absinthe: "coupe",
  "vermouth-sweet": "coupe",
  sake: "coupe",
  "wine-red": "wine",
  "wine-white": "wine",
  aperol: "wine",
  beer: "wine",
  tequila: "margarita",
  kahlua: "coffee",
  baileys: "coffee",
  brandy: "coffee",
  cognac: "coffee",
};

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
  campari: "rocks",
  rum: "tropical",
  midori: "tropical",
  champagne: "flute",
  prosecco: "flute",
  sparkling: "flute",
  tequila: "margarita",
  "triple sec": "coupe",
  absinthe: "coupe",
  sake: "coupe",
  wine: "wine",
  aperol: "wine",
  beer: "wine",
  kahlua: "coffee",
  baileys: "coffee",
  brandy: "coffee",
  cognac: "coffee",
  espresso: "coffee",
  coffee: "coffee",
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
  for (const name of ingredientNames) {
    const lower = name.toLowerCase();
    for (const [key, glass] of Object.entries(NAME_TO_GLASS)) {
      if (lower.includes(key)) return `/fallbacks/${glass}.webp`;
    }
  }
  return `/fallbacks/${DEFAULT_GLASS}.webp`;
}
