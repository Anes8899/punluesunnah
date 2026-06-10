import CategoryCard from "../features/category/CategoryCard";
import {
  kaaba,
  mosque,
  arabicLanguage,
  book,
  hadist,
  inheritance,
  leaf,
  muslim,
  religion,
  scholar,
  zakat,
  sujud,
} from "@/app/assets/icon";

const CategoryList = [
  { icon: kaaba, label: "គោលជំនឿ" },
  { icon: sujud, label: "អ៊ីហ្ពើឌះ" },
  { icon: book, label: "អាល់គុរអាន" },
  { icon: hadist, label: "ហាទីស" },
  { icon: arabicLanguage, label: "ភាសាអារ៉ាប់" },
  { icon: mosque, label: "សីលធម៌" },
  { icon: religion, label: "ទូអា" },
  { icon: leaf, label: "សម្អាតរចិត្ត" },
  { icon: muslim, label: "ឃុតបាះ" },
  { icon: zakat, label: "គណនាហ្សកាត" },
  { icon: inheritance, label: "គណនាមរតក" },
  { icon: scholar, label: "អ៊ូស្តើស" },
];

export default function CategoryPanel() {
  return (
    // flex flex-wrap justify-center gap-x-2 gap-y-4
    <div className="grid grid-cols-1 gap-4 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 mx-auto">
      {CategoryList.map((cat) => (
        <CategoryCard key={cat.label} icon={cat.icon} label={cat.label} />
      ))}
    </div>
  );
}
