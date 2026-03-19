import type { Metadata } from "next";
import { Inter, Bungee } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bungee",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Party Level Up — AI Cocktail Creator",
  description:
    "Turn your home bar into a world-class cocktail experience. Enter what you have, get amazing cocktail recipes powered by AI.",
  keywords: ["cocktails", "party", "drinks", "AI", "recipes", "mixology"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bungee.variable}`}>
      <body className="bg-brand-bg text-brand-text antialiased">
        {/* Ambient background */}
        <div
          className="ambient-blob w-96 h-96 opacity-10"
          style={{
            background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
            top: "-5rem",
            left: "-5rem",
          }}
        />
        <div
          className="ambient-blob w-80 h-80 opacity-8"
          style={{
            background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)",
            top: "30%",
            right: "-4rem",
          }}
        />
        <div
          className="ambient-blob w-72 h-72 opacity-6"
          style={{
            background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
            bottom: "10%",
            left: "30%",
          }}
        />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
