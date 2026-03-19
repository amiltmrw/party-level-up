import type { SelectionState } from "@/types";

export function buildCocktailPrompt(
  selection: SelectionState,
  excludeNames?: string[]
): string {
  const { liquors, mixers, extras } = selection;

  const excludeBlock =
    excludeNames && excludeNames.length > 0
      ? `\n\nIMPORTANT: The following cocktails have already been suggested. Do NOT repeat any of them or create similar variations. Come up with completely different recipes:\n${excludeNames.map((n) => `- ${n}`).join("\n")}\n`
      : "";

  return `You are an expert mixologist and cocktail consultant. A party host has the following ingredients available at home:

**Alcoholic Spirits/Liquors:** ${liquors.join(", ")}
**Mixers & Non-alcoholic:** ${mixers.join(", ")}
**Fruits, Herbs, Spices & Extras:** ${extras.join(", ")}
${excludeBlock}
Based ONLY on these available ingredients, create exactly 6 unique and exciting cocktail recipes. The cocktails should range from classic to creative, and at least 2 should be visually impressive or Instagram-worthy. Include at least 1 easy beginner cocktail.

Return ONLY valid JSON in this exact format (no markdown, no explanation, just raw JSON):

{
  "cocktails": [
    {
      "id": "unique-kebab-case-id",
      "name": "Cocktail Name",
      "tagline": "One enticing sentence describing the vibe",
      "difficulty": "Easy" | "Medium" | "Hard",
      "servingGlass": "Type of glass to serve in",
      "preparationTime": "X minutes",
      "ingredients": [
        { "name": "Ingredient name", "amount": "60ml" }
      ],
      "steps": [
        "Step 1 instruction",
        "Step 2 instruction"
      ],
      "tips": "Optional pro tip for this cocktail",
      "flavourProfile": ["Sweet", "Citrusy"],
      "imagePrompt": "A detailed, vivid description of how this cocktail looks in a glass for AI image generation. Describe the colour, garnish, glass type, lighting, and atmosphere. Make it photorealistic and appetising."
    }
  ]
}

Make each cocktail unique. Be creative with names — they should sound exciting for a party. Always use ml for ingredient amounts (never oz). The imagePrompt should be detailed enough to generate a stunning photorealistic cocktail image.`;
}
