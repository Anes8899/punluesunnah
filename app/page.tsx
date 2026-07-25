import CategoryPanel from "./dashboard/CategoryPanel";
import HadithCard from "./dashboard/HadithPanel";
import MakkahLivePanel from "./dashboard/MakkahLivePanel";
import PrayerPanel from "./dashboard/PrayerPanel";

export default function Home() {
  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto px-6 py-6">
     <PrayerPanel/>
     <HadithCard/>
     <CategoryPanel/>
     <MakkahLivePanel/>
    </div>
  );
}
