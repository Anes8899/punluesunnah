"use client";

import "./globals.css";
import { Amiri, Battambang, Caprasimo, Noto_Naskh_Arabic } from "next/font/google";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar from "./components/Navbar";

const khmer = Battambang({
  weight: ["400", "700", "900"],
  subsets: ["khmer"],
  variable: "--font-khmer",
});

// Display face for numerals — Khmer families have no slab cut of their own.
const display = Caprasimo({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-caprasimo",
});

const arabic = Noto_Naskh_Arabic({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
});

const quran = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-quran",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
          },
        },
      }),
  );
  return (
    <html
      className={`${khmer.variable} ${display.variable} ${arabic.variable} ${quran.variable}`}
    >
      <body
        className="bg-page min-h-screen font-sans text-ink antialiased"
        suppressHydrationWarning
      >
        <QueryClientProvider client={queryClient}>
          <Navbar />

          {/* Dynamic Route Content */}
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
