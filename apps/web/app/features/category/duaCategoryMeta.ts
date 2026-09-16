import {
  HandHeart,
  House,
  MoonStar,
  Plane,
  Sunrise,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export interface DuaCategoryMeta {
  slug: string;
  icon: LucideIcon;
  gradient: string;
}

export const CATEGORY_META: Record<string, DuaCategoryMeta> = {
  ព្រឹក: {
    slug: "morning",
    icon: Sunrise,
    gradient: "from-amber via-brand-soft to-brand",
  },
  ការគេង: {
    slug: "sleep",
    icon: MoonStar,
    gradient: "from-brand-soft via-brand to-ink",
  },
  អាហារ: {
    slug: "food",
    icon: Utensils,
    gradient: "from-gold via-amber to-brand",
  },
  ផ្ទះ: {
    slug: "home",
    icon: House,
    gradient: "from-brand-soft via-brand-soft to-brand",
  },
  ធ្វើដំណើរ: {
    slug: "travel",
    icon: Plane,
    gradient: "from-brand via-brand-soft to-gold",
  },
  ការលំបាក: {
    slug: "hardship",
    icon: HandHeart,
    gradient: "from-ink via-brand to-brand-soft",
  },
};

export const FALLBACK_META: DuaCategoryMeta = {
  slug: "other",
  icon: HandHeart,
  gradient: "from-brand via-brand-soft to-brand",
};

export function getCategoryMeta(category: string): DuaCategoryMeta {
  return CATEGORY_META[category] ?? FALLBACK_META;
}

export function getCategoryBySlug(slug: string): string | undefined {
  return Object.keys(CATEGORY_META).find(
    (category) => CATEGORY_META[category].slug === slug,
  );
}
