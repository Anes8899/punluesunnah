import Image from "next/image";
import { StaticImageData } from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "../../ui/card";

interface CategoryCardProps {
  icon: string | StaticImageData;
  label: string;
  onClick?: () => void;
  color?: string;
}

export default function CategoryCard({ icon, label, onClick, color = "bg-peach" }: CategoryCardProps) {
  return (
    <Card
      className={`group flex-row items-center gap-3 overflow-hidden ${color} py-5 cursor-pointer transition-shadow hover:shadow-md border-none`}
      onClick={onClick}
    >
      <CardContent className="flex min-w-0 flex-1 flex-col gap-1 px-0 pl-4">
        <span className="block truncate font-heading text-xs sm:text-sm font-semibold leading-snug">
          {label}
        </span>
        <span className="flex items-center gap-1.5 mt-5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:rotate-45">
            <ArrowUpRight className="h-3 w-3" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            មើលបន្ថែម
          </span>
        </span>
      </CardContent>

      <div className="mr-4 flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background">
        <Image
          src={icon}
          alt={label}
          className="h-9 w-9 sm:h-12 sm:w-12 object-contain transition-transform group-hover:scale-105"
        />
      </div>
    </Card>
  );
}
