import Image from "next/image";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";

interface UstazCard {
  href?: () => void;
  image?: string;
  name: string;
  description?: string;
}

export default function UstazCard({
  href,
  image,
  name,
  description,
}: UstazCard) {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <Image
        src={`${image}`}
        alt="Event cover"
        width={90}
        height={90}
        className="h-full w-full object-contain"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" onClick={href}>
          ចុចត្រុងនេះ
        </Button>
      </CardFooter>
    </Card>
  );
}
