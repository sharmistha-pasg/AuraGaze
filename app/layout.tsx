import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Lexend } from "next/font/google";
import "./globals.css";

const atkinson = Atkinson_Hyperlegible({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-atkinson",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AuraGaze",
  description: "A sensory-safe way to read the web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${atkinson.variable} ${lexend.variable}`}>
      <body className="bg-[var(--ag-bg)] text-[var(--ag-text)] font-[family-name:var(--font-atkinson)] antialiased min-h-screen">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--ag-surface)] focus:text-[var(--ag-text)] focus:border focus:border-[var(--ag-border)]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
