import Image from "next/image";
import CategoryPanel from "./dashboard/CategoryPanel";
import HadithCard from "./dashboard/HadithPanel";
import MakkahLivePanel from "./dashboard/MakkahLivePanel";
import PrayerPanel from "./dashboard/PrayerPanel";

export default function Home() {
  return (
    <>
      <div className="relative">
        <PrayerPanel />
        <Image
          src="/assets/mandala-frame.svg"
          alt=""
          aria-hidden
          fill
          unoptimized
          loading="eager"
          sizes="100vw"
          className="pointer-events-none absolute inset-0 hidden h-full w-full select-none object-contain opacity-70 mix-blend-multiply md:block dark:opacity-40 dark:mix-blend-soft-light"
        />
      </div>
      <div className="flex flex-col gap-5 max-w-7xl mx-auto px-6 py-6">
        <HadithCard />
        <CategoryPanel />
        <MakkahLivePanel />
      </div>
    </>
  );
}
