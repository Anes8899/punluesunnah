"use client";

import Image from "next/image";
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
  social?: { facebook: string | null; youtube: string | null };
};

export default function UstazCard({
  id,
  image,
  name,
  description,
  social,
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
        <CardAction className="flex gap-2">
          {social?.facebook && (
            <Button variant="outline" size="icon" asChild>
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Facebook របស់ ${name}`}
              >
                <Image
                  src="/assets/Facebook_logo_(square).png"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
              </a>
            </Button>
          )}
          {social?.youtube && (
            <Button variant="outline" size="icon" asChild>
              <a
                href={social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`YouTube របស់ ${name}`}
              >
                <Image
                  src="/assets/YouTube_full-color_icon_(2024).svg.webp"
                  alt="YouTube"
                  width={20}
                  height={20}
                />
              </a>
            </Button>
          )}
        </CardAction>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-0">
        <Button
          className="w-full h-full py-4 rounded-t-none rounded-b-xl cursor-pointer font-semibold transition hover:bg-primary/85 active:bg-primary/75"
          onClick={() => router.push(`/ustaz/${id}`)}
        >
          ចុចត្រុងនេះ
        </Button>
      </CardFooter>
    </Card>
  );
}
