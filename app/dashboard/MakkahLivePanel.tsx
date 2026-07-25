"use client";

import { AspectRatio } from "../ui/aspect-ratio";
import { Badge } from "../ui/badge";

// Saudi Quran TV (KSA Qur'an TV) — official 24/7 broadcast of Masjid al-Haram,
// retransmitted by the General Presidency for the Affairs of the Two Holy Mosques.
const MAKKAH_LIVE_CHANNEL_ID = "UCos52azQNBgW63_9uDJoPDA";

export default function MakkahLivePanel() {
  return (
    <div className="rounded-lg bg-surface border border-[#e8d9bb] shadow-md flex flex-col p-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="scroll-m-20 text-lg font-extrabold tracking-tight text-balance">
          ការផ្សាយផ្ទាល់ពីម៉ាក្កា
        </h1>
        <Badge
          variant="destructive"
          className="gap-1.5 bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300"
        >
          <span className="size-1.5 rounded-full bg-red-600 animate-pulse" />
          LIVE
        </Badge>
      </div>
      <AspectRatio
        ratio={16 / 9}
        className="w-full rounded-xl overflow-hidden bg-black"
      >
        <iframe
          src={`https://www.youtube.com/embed/live_stream?channel=${MAKKAH_LIVE_CHANNEL_ID}&autoplay=0`}
          title="ការផ្សាយផ្ទាល់ពីម៉ាក្កា"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </AspectRatio>
    </div>
  );
}
