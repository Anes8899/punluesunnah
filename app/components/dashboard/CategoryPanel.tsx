import CategoryCard from "../features/category/CategoryCard";
import { mosque, kaaba } from "@/app/assets/icon";

const CategoryList = [
  { icon: kaaba, label: "គោលជំនឿ" },
  { icon: mosque, label: "នមាស្ការ" },
];

export default function CategoryPanel() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {CategoryList.map((cat) => (
        <CategoryCard key={cat.label} icon={cat.icon} label={cat.label} />
      ))}
    </div>
  );
}
