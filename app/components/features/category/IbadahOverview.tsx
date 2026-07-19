"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePrayerTimes } from "@/app/hook/usePrayerTimes";

const TAJWEED = {
  qalqalah: "#4a6fa1",
  ghunnah: "#c2447a",
  madd: "#b23a3a",
} as const;

interface CategoryItem {
  ar: string;
  km: string;
  tone: "accent" | "accent-2";
}

const CATEGORIES: CategoryItem[] = [
  { ar: "الصلاة", km: "សឡាត", tone: "accent" },
  { ar: "الصوم", km: "ការតមអាហារ", tone: "accent-2" },
  { ar: "الزكاة", km: "សាការាត", tone: "accent" },
  { ar: "الحج", km: "ការធ្វើហាជ្ជ", tone: "accent-2" },
  { ar: "الذكر", km: "ការរំលឹកអល់ឡោះ", tone: "accent" },
];

const CONDITIONS = [
  {
    ar: "الإخلاص",
    tone: "accent" as const,
    title: "សេចក្តីស្មោះត្រង់ (Ikhlas)",
    body: "ធ្វើគ្រប់ការគោរពប្រណិប័តន៍សុទ្ធសាធសម្រាប់អល់ឡោះតែមួយគត់ គ្មានការចង់បានការសរសើរ ឬផលប្រយោជន៍ពីមនុស្សឡើយ។",
  },
  {
    ar: "المتابعة",
    tone: "accent-2" as const,
    title: "ការធ្វើតាមស៊ុណ្ណះ (Al-Mutaba'ah)",
    body: "អនុវត្តតាមរបៀបរបស់ព្យាការីមូហាំម៉ាត់ ﷺ ត្រឹមត្រូវ គ្មានការបន្ថែម ឬកាត់បន្ថយពីអ្វីដែលបានបង្រៀនឡើយ។",
  },
];

const PRAYER_LABEL: Record<string, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

function toneClasses(tone: "accent" | "accent-2") {
  return tone === "accent"
    ? { bg: "bg-[#fff2eb]", dot: "bg-[#c67139]", text: "text-[#643312]" }
    : { bg: "bg-[#f0fae1]", dot: "bg-[#7a8a5e]", text: "text-[#3d472b]" };
}

export default function IbadahOverview() {
  const { data: times } = usePrayerTimes();
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);

  useEffect(() => {
    if (!times) return;
    const tick = () => {
      const next = times.nextPrayer();
      if (next !== "sunrise" && next !== "none") {
        setNextPrayer(next);
      }
    };
    tick();
    const interval = setInterval(tick, 30_000);
    return () => clearInterval(interval);
  }, [times]);

  return (
    <div className="overflow-hidden rounded-lg bg-[#f5ead8] text-[#201e1d]">
      <div className="mx-auto max-w-[900px] px-5 pb-16 sm:px-10 sm:pb-20 lg:px-14 lg:pb-24">
        {/* 1. Hero */}
        <section className="relative pt-14 pb-10 text-center sm:pt-20 sm:pb-14 lg:pt-24 lg:pb-16">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='none' stroke='%23c67139' stroke-opacity='0.14' stroke-width='1'><path d='M60 4 L92 26 L104 60 L92 94 L60 116 L28 94 L16 60 L28 26 Z'/><path d='M60 4 L60 116 M16 60 L104 60 M28 26 L92 94 M92 26 L28 94'/><circle cx='60' cy='60' r='18'/></g></svg>\")",
              backgroundSize: "120px 120px",
              maskImage: "radial-gradient(ellipse at center, black, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 75%)",
            }}
          />
          <h1 className="font-quran text-7xl leading-tight font-bold text-[#643312] sm:text-8xl lg:text-9xl">
            العبادة
          </h1>
          <p className="mx-auto mt-4 max-w-[46ch] text-lg text-[#201e1d]/82 sm:text-xl">
            អត្ថន័យនៃការគោរពប្រណិប័តន៍ក្នុងឥស្លាម
          </p>

          {nextPrayer && (
            <div className="mt-6 inline-flex items-center gap-3 rounded-[999px] bg-[#fff2eb] px-4 py-2 shadow-[0_1px_2px_rgba(46,43,37,0.14)]">
              <span className="inline-flex items-center rounded-full bg-[#f0fae1] px-3 py-1 text-xs text-[#3d472b]">
                ម៉ោងសឡាតបន្ទាប់
              </span>
              <span className="text-xl font-bold text-[#643312]">
                {PRAYER_LABEL[nextPrayer] ?? nextPrayer}
              </span>
            </div>
          )}
        </section>

        {/* 2. What is Ibadah */}
        <section className="border-t border-[#201e1d]/16 py-8 sm:py-12 lg:py-14">
          <span className="mb-4 inline-block rounded-full border border-[#c67139] px-3 py-1 text-xs text-[#c67139]">
            អត្ថន័យ
          </span>
          <div className="flex flex-col items-start gap-4">
            <div className="font-quran text-right text-3xl leading-[1.9] sm:text-4xl">
              وَمَا خَلَ<span style={{ color: TAJWEED.qalqalah }}>قْ</span>تُ الْ
              <span style={{ color: TAJWEED.ghunnah }}>جِنَّ</span> وَالْإِنسَ إِلَّا لِيَعْبُ
              <span style={{ color: TAJWEED.madd }}>دُو</span>نِ
            </div>
            <div>
              <p className="m-0 mb-2 text-[17px] leading-[1.8] text-[#201e1d]/80 italic">
                «ហើយយើងមិនបានបង្កើតជិន និងមនុស្សលោក ក្រៅពីឲ្យពួកគេគោរពសក្ការៈយើងឡើយ»
              </p>
              <p className="m-0 text-[11px] text-[#201e1d]/55">សូរ៉ោះអាហ្ស៊្ហារីយ៉ាត ៥១:៥៦</p>
            </div>
          </div>
          <p className="mt-6 max-w-[58ch] text-[15.5px] leading-[1.8] text-[#201e1d]/82">
            ការគោរពប្រណិប័តន៍ (العبادة) គឺជារាល់ពាក្យសម្តី ទង្វើ និងជំនឿ
            ដែលអល់ឡោះស្រឡាញ់ និងពេញចិត្ត ទាំងខាងក្រៅ និងខាងក្នុងចិត្ត។
            វាគ្របដណ្តប់លើគ្រប់ទង្វើក្នុងជីវិតប្រចាំថ្ងៃ
            ប្រសិនបើធ្វើដោយចេតនាដ៏ស្មោះត្រង់ចំពោះអល់ឡោះ។
          </p>
        </section>

        {/* 3. Categories */}
        <section className="border-t border-[#201e1d]/16 py-8 sm:py-12 lg:py-14">
          <span className="mb-4 inline-block rounded-full border border-[#c67139] px-3 py-1 text-xs text-[#c67139]">
            ប្រភេទ
          </span>
          <h2 className="mb-6 text-2xl font-bold">ប្រភេទនៃការគោរពប្រណិប័តន៍</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {CATEGORIES.map((c, i) => {
              const tc = toneClasses(c.tone);
              return (
                <Fragment key={c.ar}>
                  {i === 3 && <div className="h-0 basis-full" />}
                  <div
                    className={`flex max-w-[260px] flex-1 basis-[220px] flex-col items-center gap-2 rounded-[16px] p-3.5 text-center shadow-[0_1px_2px_rgba(46,43,37,0.14)] ${tc.bg}`}
                  >
                    <span className={`block size-2.5 rounded-full ${tc.dot}`} />
                    <div className={`font-quran text-3xl font-bold ${tc.text}`}>{c.ar}</div>
                    <div className="text-sm text-[#201e1d]/75">{c.km}</div>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </section>

        {/* 4. Ayah of the day */}
        <section className="border-t border-[#201e1d]/16 py-8 sm:py-12 lg:py-14">
          <span className="mb-4 inline-block rounded-full border border-[#c67139] px-3 py-1 text-xs text-[#c67139]">
            ប្រចាំថ្ងៃ
          </span>
          <div className="rounded-[16px] bg-[#ebddc5] p-6 shadow-[0_3px_10px_rgba(46,43,37,0.16)]">
            <div className="font-quran mb-4 text-center text-2xl leading-[1.9] sm:text-3xl">
              فَاذْكُرُونِي أَ<span style={{ color: TAJWEED.ghunnah }}>ذْكُرْكُمْ</span> وَاشْكُرُوا لِي
              وَلَا تَكْفُ<span style={{ color: TAJWEED.madd }}>رُو</span>نِ
            </div>
            <p className="m-0 mb-1 text-center text-[15.5px] leading-[1.8] text-[#201e1d]/80 italic">
              «ដូច្នេះ ចូររំលឹកយើង នោះយើងនឹងរំលឹកអ្នក ចូរដឹងគុណយើង កុំរមិលគុណ»
            </p>
            <p className="m-0 text-center text-[11px] text-[#201e1d]/55">
              សូរ៉ោះអាល់-បាការ៉ោះ ២:១៥២ · គំរូ
            </p>
          </div>
        </section>

        {/* 5. Conditions */}
        <section className="border-t border-[#201e1d]/16 py-8 sm:py-12 lg:py-14">
          <span className="mb-4 inline-block rounded-full border border-[#c67139] px-3 py-1 text-xs text-[#c67139]">
            លក្ខខណ្ឌ
          </span>
          <h2 className="mb-6 text-2xl font-bold">លក្ខខណ្ឌនៃការទទួលយកអំពើល្អ</h2>
          <div className="flex flex-col gap-4">
            {CONDITIONS.map((c) => {
              const tc = toneClasses(c.tone);
              return (
                <div
                  key={c.ar}
                  className={`flex flex-row items-center gap-4 rounded-[16px] p-3.5 shadow-[0_1px_2px_rgba(46,43,37,0.14)] ${tc.bg}`}
                >
                  <div className={`font-quran min-w-[100px] flex-none text-center text-3xl font-bold ${tc.text}`}>
                    {c.ar}
                  </div>
                  <div>
                    <div className="mb-0.5 text-[15px] font-semibold">{c.title}</div>
                    <p className="m-0 text-[13.5px] leading-[1.7] opacity-[0.82]">{c.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Closing CTA */}
        <section className="border-t border-[#201e1d]/16 pt-10 text-center sm:pt-14 lg:pt-16">
          <h3 className="mb-2 text-xl font-bold sm:text-2xl">បន្តការសិក្សា និងគោរពប្រណិប័តន៍</h3>
          <p className="mx-auto mb-6 max-w-[48ch] text-sm text-[#201e1d]/75 sm:text-[14.5px]">
            អានគម្ពីរគូរអាន និងតាមដានម៉ោងសឡាតប្រចាំថ្ងៃនៅលើគេហទំព័រ។
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/quran"
              className="rounded-full bg-[#c67139] px-5 py-2.5 text-sm font-bold text-[#f5ead8] hover:bg-[#b2622d]"
            >
              អានគម្ពីរគូរអាន
            </Link>
            <Link
              href="/"
              className="rounded-full border border-[#201e1d]/16 px-5 py-2.5 text-sm font-bold hover:bg-[#201e1d]/7"
            >
              មើលម៉ោងសឡាត
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
