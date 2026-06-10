import { getHijriDate } from "@/lib/hijri";
import "./globals.css";
import { Battambang, Noto_Naskh_Arabic } from "next/font/google"
import myImage from "@/app/assets/icon/logo.png";
import Image from "next/image";



const khmer = Battambang({
  weight: ["400", "700"],
  subsets: ["khmer"],
  variable: "--font-khmer",
})

const arabic = Noto_Naskh_Arabic({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${khmer.variable} ${arabic.variable}`}>
      <body
        className="bg-[#f0f4f8] min-h-screen font-sans text-slate-800 antialiased"
        suppressHydrationWarning
      >
        {/* Top Branding Bar */}
        <header className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-full bg-[#00966b] flex items-center justify-center text-white font-bold">
              LS
            </div> */}
            <Image src={myImage} alt="description" width={100} height={100} />
            <div>
              <h1 className="font-bold text-lg text-slate-800">
                The Light Of Sunnah
              </h1>
              <p className="text-xs text-slate-400">ពន្លឺ នៃ ស៊ុណ្ណះ</p>
            </div>
          </div>
          {/* <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span>📍 ភ្នំពេញ</span>
            <span className="text-[#00966b]">{getHijriDate()}</span>
          </div> */}
        </header>

        {/* Dynamic Route Content */}
        <main className="max-w-7xl mx-auto px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
