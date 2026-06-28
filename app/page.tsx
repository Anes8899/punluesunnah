import CategoryPanel from "./components/dashboard/CategoryPanel";
import HadithCard from "./components/dashboard/HadithPanel";
import PrayerPanel from "./components/dashboard/PrayerPanel";

export default function Home() {
  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto px-6 py-6">
     <PrayerPanel/>
     <HadithCard/>
     <CategoryPanel/>
    </div>
  );
}
