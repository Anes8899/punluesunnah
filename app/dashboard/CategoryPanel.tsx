"use client"; 

import { useRouter } from "next/navigation";
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
} from "@/public/assets/icon";

const CategoryList = [
  { icon: kaaba, label: "គោលជំនឿ", href: "/aqidah" },
  { icon: sujud, label: "អ៊ីហ្ពើឌះ", href: "/ibadah" },
  { icon: book, label: "អាល់គុរអាន", href: "/quran" },
  { icon: hadist, label: "ហាទីស", href: "/hadith" },
  { icon: arabicLanguage, label: "ភាសាអារ៉ាប់", href: "/arabic-language" },
  { icon: mosque, label: "សីលធម៌", href: "/akhlaq" },
  { icon: religion, label: "ទូអា", href: "/dua" },
  { icon: leaf, label: "សម្អាតរចិត្ត", href: "/tazkiyah" },
  { icon: muslim, label: "ឃុតបាះ", href: "/khutbah" },
  { icon: zakat, label: "គណនាហ្សកាត", href: "/zakat-calculator" },
  { icon: inheritance, label: "គណនាមរតក", href: "/inheritance-calculator" },
  { icon: scholar, label: "អ៊ូស្តើស", href: "/ustaz" },
];

export default function CategoryPanel() {
    const router = useRouter();

  return (
    // flex flex-wrap justify-center gap-x-2 gap-y-4
    <div className="grid grid-cols-1 gap-4 xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 mx-auto">
      {CategoryList.map((cat) => (
        <CategoryCard key={cat.label} icon={cat.icon} label={cat.label} onClick={() => cat.href ? router.push(cat.href) : undefined} />
      ))}
    </div>
  );
}
