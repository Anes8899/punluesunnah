import Image from "next/image";
import CategoryPanel from "./dashboard/CategoryPanel";
import HadithCard from "./dashboard/HadithPanel";
import MakkahLivePanel from "./dashboard/MakkahLivePanel";
import PrayerPanel from "./dashboard/PrayerPanel";

export default function Home() {
  return (
    <>
      {/* The prayer panel is full-bleed on desktop, so it sits outside the
          centred column the rest of the dashboard lives in. This box takes its
          height from the panel, and the frame below stretches to fill it, so
          the two always end up exactly the same size. */}
      <div className="relative md:min-h-[calc(100dvh-132px)]">
        <PrayerPanel />

        {/* Ornamental mandala frame around the desktop panel: the art sits on
            a near-white sheet, so it is multiplied into the cream surface
            instead of masked. `fill` pins it to this box's edges and
            `object-fill` lets it stretch to the panel's height rather than
            letterboxing, so the frame border tracks the panel's own top and
            bottom. It follows the panel in the markup so it paints over the
            panel's surface colour, while the panel's content stays above it
            on z-10. */}
        <Image
          src="/assets/mandala-frame.svg"
          alt=""
          aria-hidden
          fill
          unoptimized
          loading="eager"
          sizes="100vw"
          className="pointer-events-none absolute inset-0 hidden h-full w-full select-none object-fill opacity-70 mix-blend-multiply md:block dark:opacity-40 dark:mix-blend-soft-light"
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
