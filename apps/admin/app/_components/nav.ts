import {
  BookOpen,
  HandHeart,
  Heart,
  LayoutDashboard,
  Mic,
  ScrollText,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const OVERVIEW: NavItem = {
  href: "/",
  label: "ផ្ទាំងគ្រប់គ្រង",
  icon: LayoutDashboard,
};

export const CONTENT_NAV: NavItem[] = [
  { href: "/books", label: "សៀវភៅ", icon: BookOpen },
  { href: "/ustaz", label: "អ៊ូស្តាស", icon: Users },
  { href: "/dua", label: "ទូអា", icon: HandHeart },
  { href: "/hadith", label: "ហាទីស", icon: ScrollText },
  { href: "/khutbah", label: "ខុតបះ", icon: Mic },
  { href: "/tazkiyah", label: "តាហ្សគីយ៉ះ", icon: Sparkles },
  { href: "/akhlaq", label: "អាខ្លាក", icon: Heart },
];
