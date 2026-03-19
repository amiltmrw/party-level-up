import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 10;

const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt";

export async function POST(req: NextRequest) {
  try {
    const { prompt, cocktailId } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt required." }, { status: 400 });
    }

    // Keep prompt short to avoid URL length issues
    const shortened = (prompt as string).slice(0, 200);
    const enhanced = `${shortened}, cocktail photography, dark bar, neon lighting, photorealistic`;
    const encodedPrompt = encodeURIComponent(enhanced);
    const url = `${POLLINATIONS_BASE}/${encodedPrompt}?width=512&height=512&model=turbo&nologo=true`;

    // Fetch the image server-side — avoids CORS and browser timeout issues
    const response = await fetch(url, {
      signal: AbortSignal.timeout(9000),
    });

    if (!response.ok) {
      return NextResponse.json({ imageUrl: null, cocktailId });
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const imageUrl = `data:${contentType};base64,${base64}`;

    return NextResponse.json({ imageUrl, cocktailId });
  } catch (error) {
    console.error("Image error:", error);
    return NextResponse.json({ imageUrl: null, cocktailId: null });
  }
}
