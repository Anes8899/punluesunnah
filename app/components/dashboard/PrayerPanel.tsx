import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import mosque from "../../../public/icon/mosque.png";
import { MapPin } from "lucide-react";
import PlayerCard from "../features/prayer/PrayerCard";

export default function PrayerPanel() {
  return (
    <div>
      <AspectRatio
        ratio={16 / 13}
        className="rounded-lg bg-white shadow-md flex flex-col p-5"
      >
        <div className="w-52 mx-auto flex flex-col justify-center items-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <Image src={mosque} alt="mosque" className="w-8 h-8" />
            <h1 className="scroll-m-20 text-center text-lg font-extrabold tracking-tight text-balance">
              ម៉ោងសឡាត
            </h1>
          </div>
          <div className="flex items-center justify-center gap-1 px-2">
            <MapPin className="w-4 h-4 shrink-0 text-red-500" />
            <p>Phnom Penh</p>
          </div>
          <div className="flex items-center justify-center gap-1 px-2">
            <p>6 Dhū al-Ḥijjah 1447</p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p>ថ្ងៃនេះ</p>
            <p>ថ្ងៃសៅរ៍ ទី២៣ ឧសភា ២០២៦</p>
          </div>
          <div className="flex flex-col">
            <p>បន្ទាប់: អាសើរ</p>
            <p>-00:46:37</p>
          </div>
        </div>
        <div className="flex gap-2 pt-3 items-center justify-center">
          <PlayerCard />
          <PlayerCard />
          <PlayerCard />
          <PlayerCard />
          <PlayerCard />
        </div>
      </AspectRatio>
    </div>
  );
}
