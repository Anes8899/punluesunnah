"use client";

import "./globals.css";
import { Amiri, Battambang, Noto_Naskh_Arabic } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const khmer = Battambang({
  weight: ["400", "700"],
  subsets: ["khmer"],
  variable: "--font-khmer",
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
    <html className={`${khmer.variable} ${arabic.variable} ${quran.variable}`}>
      <body
        className="bg-surface min-h-screen font-sans text-slate-800 antialiased"
        suppressHydrationWarning
      >
        <QueryClientProvider client={queryClient}>
          {/* Top Branding Bar */}
          <header className="w-full bg-surface px-6 py-4">
            <Link
              href="/"
              className="flex items-start justify-start gap-3 px-8 w-fit"
            >
              <Image
                src="/assets/icon/logo.png"
                alt="The Light Of Sunnah logo"
                width={100}
                height={100}
              />
              <div>
                <h1 className="font-bold text-lg text-slate-800 items-start justify-start">
                  The Light Of Sunnah
                </h1>
                <p className="text-xs text-slate-400">ពន្លឺ នៃ ស៊ុណ្ណះ</p>
              </div>
            </Link>
          </header>

          {/* Dynamic Route Content */}
        {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
