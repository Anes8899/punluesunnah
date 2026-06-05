import { Cloud } from "lucide-react";
import { AspectRatio } from "../../ui/aspect-ratio";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";

interface PrayerTime {
  nameTimePrayer: string;
  timePrayer: string;
}

export default function PrayerCard({ nameTimePrayer, timePrayer }: PrayerTime) {
  return (
    <Card className="w-full rounded-2xl py-3">
      <Cloud className="w-8 h-8 text-amber-300 mx-auto" />
      <CardHeader className="p-0 w-full">
        <CardTitle className="mx-auto">{nameTimePrayer}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-center gap-1">
        <p className="text-gray-700 text-lg font-bold tabular-nums">
          {timePrayer}
        </p>
      </CardContent>
    </Card>
  );
}
