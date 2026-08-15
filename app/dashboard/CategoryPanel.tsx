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

const CardColors = [
  "bg-peach",
  "bg-blue-100",
  "bg-emerald-100",
  "bg-violet-100",
  "bg-rose-100",
  "bg-amber-100",
  "bg-cyan-100",
  "bg-lime-100",
];

export default function CategoryPanel() {
    const router = useRouter();

  return (
    <div className="grid w-full gap-4 grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
      {CategoryList.map((cat, index) => (
        <CategoryCard
          key={cat.label}
          icon={cat.icon}
          label={cat.label}
          color={CardColors[index % CardColors.length]}
          onClick={() => cat.href ? router.push(cat.href) : undefined}
        />
      ))}
    </div>
  );
}
