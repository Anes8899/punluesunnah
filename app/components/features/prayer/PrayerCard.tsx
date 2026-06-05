import { DynamicIcon, IconName } from 'lucide-react/dynamic';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card";

interface PrayerTime {
  nameTimePrayer: string;
  timePrayer: string;
  icon: IconName;
}

export default function PrayerCard({ nameTimePrayer, timePrayer, icon }: PrayerTime) {
  return (
    <Card className="w-full rounded-2xl py-3">
       <DynamicIcon name={icon} color="black" className="w-10 h-10 mx-auto" />
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
