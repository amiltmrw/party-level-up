import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#08080f",
          surface: "#0f0f1a",
          card: "#13131f",
          border: "#1e1e32",
          violet: "#7c3aed",
          "violet-glow": "#9d5cf6",
          cyan: "#22d3ee",
          gold: "#fbbf24",
          muted: "#6b7280",
          text: "#e2e8f0",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "glow-violet": "0 0 20px rgba(124, 58, 237, 0.35)",
        "glow-cyan": "0 0 20px rgba(34, 211, 238, 0.25)",
        "glow-gold": "0 0 20px rgba(251, 191, 36, 0.25)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-bungee)", "cursive"],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "pulse-soft": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
