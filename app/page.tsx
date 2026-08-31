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
          height from the panel, which from `xl` up is locked to the frame's
          own aspect ratio, so the two match without the art being scaled
          unevenly. */}
      <div className="relative">
        <PrayerPanel />

        {/* Ornamental mandala frame around the desktop panel: the art sits on
            a near-white sheet, so it is multiplied into the cream surface
            instead of masked. Only its width is responsive — `object-contain`
            keeps the height tied to that width at the art's own ratio, since
            scaling the two axes apart visibly warps the corner motifs. The
            panel carries the matching aspect ratio, so the frame still lands
            on its edges. It follows the panel in the markup so it paints over
            the panel's surface colour, while the panel's content stays above
            it on z-10. */}
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
