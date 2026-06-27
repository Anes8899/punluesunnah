import UstazCard from "../components/features/category/UstazCard";
import ustazData from "@/data/ustaz.json";

export default function Page() {
  return (
    <div className="border-2 gap-2 grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2">
      {ustazData.map((ustaz) => (
        <UstazCard key={ustaz.id} name={ustaz.name} image={ustaz.image} />
      ))}
    </div>
  );
}
