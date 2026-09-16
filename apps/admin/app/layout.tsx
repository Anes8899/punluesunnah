import type { Metadata } from "next";
import { connection } from "next/server";
import { Battambang, Caprasimo, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/app/ui/sonner";
import AdminSidebar from "./_components/AdminSidebar";

// Same faces as apps/web so content previews match the public site.
const khmer = Battambang({
  weight: ["400", "700", "900"],
  subsets: ["khmer"],
  variable: "--font-khmer",
});

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

export const metadata: Metadata = {
  title: "ផ្ទាំងគ្រប់គ្រង · ពន្លឺស៊ុណ្ណះ",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Every admin screen reads live content, so the whole app renders at
  // request time rather than being prerendered at build.
  await connection();

  return (
    <html
      lang="km"
      className={`${khmer.variable} ${display.variable} ${arabic.variable}`}
    >
      <body className="bg-background text-foreground min-h-screen font-sans antialiased">
        <div className="flex min-h-screen flex-col md:flex-row">
          <AdminSidebar />
          <main className="min-w-0 flex-1">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  );
}
