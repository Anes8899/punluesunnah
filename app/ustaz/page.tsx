import UstazCard from "../features/category/UstazCard";
import ustazData from "@/data/ustaz.json";

export default function Page() {

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 max-w-7xl mx-auto px-6 py-6 gap-4">
      {ustazData.map((ustaz) => (
        <UstazCard
          id={ustaz.id}
          key={ustaz.id}
          name={ustaz.name}
          image={ustaz.image}
          social={ustaz.social}
        />
      ))}
    </div>
  );
}
