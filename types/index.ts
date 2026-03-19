export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  category?: string;
}

export interface CocktailRecipe {
  id: string;
  name: string;
  tagline: string;
  difficulty: "Easy" | "Medium" | "Hard";
  servingGlass: string;
  preparationTime: string;
  ingredients: {
    name: string;
    amount: string;
  }[];
  steps: string[];
  tips?: string;
  imagePrompt: string;
  imageUrl?: string;
  flavourProfile: string[];
}

export interface GenerateResponse {
  cocktails: CocktailRecipe[];
}

export type Step = "liquors" | "mixers" | "extras" | "generating" | "results";

export interface SelectionState {
  liquors: string[];
  mixers: string[];
  extras: string[];
}
