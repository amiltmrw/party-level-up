import Groq from "groq-sdk";

export const GROQ_MODEL = "llama-3.3-70b-versatile";

export function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not set. Please add it to your .env.local file. Get a free key at console.groq.com"
    );
  }
  return new Groq({ apiKey });
}
