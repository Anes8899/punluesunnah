import CategoryPanel from "./components/dashboard/CategoryPanel";
import HadithCard from "./components/dashboard/HadithPanel";
import PrayerPanel from "./components/dashboard/PrayerPanel";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
     <PrayerPanel/>
     <HadithCard/>
     <CategoryPanel/>
    </div>
  );
}
