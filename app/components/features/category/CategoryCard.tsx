import Image from "next/image";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { StaticImageData } from "next/image";


interface CategoryCardProps {
  icon: string | StaticImageData;
  label: string;
  onClick?: () => void;
}

export default function CategoryCard({icon, label, onClick}: CategoryCardProps) {
  return (
    <Card className="items-center w-28 h-28 " onClick={onClick}>
      <CardHeader className="w-20 h-20">
        <Image src={icon} alt="kaaba" className="w-full" />
      </CardHeader>
      <CardContent>{label}</CardContent>
    </Card>
  );
}
