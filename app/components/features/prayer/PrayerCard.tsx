import { DynamicIcon, IconName } from "lucide-react/dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface PrayerTime {
  nameTimePrayer: string;
  timePrayer: string;
  icon: IconName;
}

export default function PrayerCard({
  nameTimePrayer,
  timePrayer,
  icon,
}: PrayerTime) {
  return (
    <Card className="w-full rounded-2xl py-3">
      <div className="bg-muted rounded-full w-12 h-12 flex items-center justify-center mx-auto">
        <DynamicIcon name={icon} color="black" className="w-6 h-6" />
      </div>
      <CardHeader className="p-0 w-full">
        <CardTitle className="mx-auto">{nameTimePrayer}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col items-center gap-1">
        <p className="text-xl font-medium tabular-nums tracking-tight">
          {timePrayer}
        </p>
      </CardContent>
    </Card>
  );
}
