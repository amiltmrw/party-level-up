import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL } from "@/lib/ai";
import { buildCocktailPrompt } from "@/lib/prompts";
import type { SelectionState, GenerateResponse } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { liquors, mixers, extras, excludeNames } = body as SelectionState & { excludeNames?: string[] };

    if (!liquors?.length && !mixers?.length && !extras?.length) {
      return NextResponse.json(
        { error: "Please select at least one ingredient." },
        { status: 400 }
      );
    }

    const prompt = buildCocktailPrompt({ liquors, mixers, extras }, excludeNames);
    const groq = getGroqClient();

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert mixologist. Always respond with valid JSON only — no markdown, no explanation, no code fences. Just raw JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.85,
      max_tokens: 8192,
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content ?? "";

    let parsed: GenerateResponse;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.error("Failed to parse Groq response:", text);
      return NextResponse.json(
        { error: "AI returned an unexpected format. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Generate API error:", error);
    const message = error instanceof Error ? error.message : "";
    if (message.includes("429") || message.includes("rate_limit") || message.includes("Rate limit")) {
      return NextResponse.json(
        { error: "Rate limit reached. Please wait a moment and try again." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong generating cocktails. Please try again." },
      { status: 500 }
    );
  }
}
