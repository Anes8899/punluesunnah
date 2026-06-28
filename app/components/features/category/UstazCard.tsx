"use client";

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
import { useRouter } from "next/navigation";

type UstazCard = {
  id: number;
  image?: string;
  name: string;
  description?: string;
};

export default function UstazCard({
  id,
  image,
  name,
  description,
}: UstazCard) {
  const router = useRouter();
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="relative w-full aspect-square bg-muted overflow-hidden rounded-t-xl">
        <Image
          src={`${image}`}
          alt="Ustaz cover"
          fill
          className="object-contain"
        />
      </div>
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => router.push(`/ustaz/${id}`)}
        >
          ចុចត្រុងនេះ
        </Button>
      </CardFooter>
    </Card>
  );
}
