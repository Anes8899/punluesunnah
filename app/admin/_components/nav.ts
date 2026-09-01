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
  href: "/admin",
  label: "ផ្ទាំងគ្រប់គ្រង",
  icon: LayoutDashboard,
};

export const CONTENT_NAV: NavItem[] = [
  { href: "/admin/books", label: "សៀវភៅ", icon: BookOpen },
  { href: "/admin/ustaz", label: "អ៊ូស្តាស", icon: Users },
  { href: "/admin/dua", label: "ទូអា", icon: HandHeart },
  { href: "/admin/hadith", label: "ហាទីស", icon: ScrollText },
  { href: "/admin/khutbah", label: "ខុតបះ", icon: Mic },
  { href: "/admin/tazkiyah", label: "តាហ្សគីយ៉ះ", icon: Sparkles },
  { href: "/admin/akhlaq", label: "អាខ្លាក", icon: Heart },
];
