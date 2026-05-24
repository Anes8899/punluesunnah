import { Cloud } from "lucide-react";
import { AspectRatio } from "../../ui/aspect-ratio";

export default function PrayerCard() {
  return (
    <AspectRatio
      ratio={1 / 1}
      className="w-16 h-20 rounded-2xl border"
    >
      {/* Decorative ring */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-3/4 h-3/4 rounded-full" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <Cloud className="w-8 h-8 text-amber-300 mb-1" />
        <p className="text-amber-200 text-sm font-medium tracking-widest uppercase">
          ហ្វាជើរ
        </p>
        <p className="text-gray-700 text-lg font-bold tabular-nums">04:10</p>
      </div>

    </AspectRatio>
  );
}
