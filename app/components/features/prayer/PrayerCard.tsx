import { DynamicIcon, IconName } from "lucide-react/dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface PrayerTime {
  nameTimePrayer: string;
  timePrayer: string;
  icon: IconName;
  nextPrayer: boolean;
}

export default function PrayerCard({
  nameTimePrayer,
  timePrayer,
  icon,
  nextPrayer,
}: PrayerTime) {
  return (
    <Card
      className={`w-full rounded-2xl py-3 ${nextPrayer ? "bg-green-700" : ""}`}
    >
      <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-0 px-3 sm:px-0">
        <div className="bg-muted rounded-full shrink-0 w-12 h-12 flex items-center justify-center mx-auto">
          <DynamicIcon name={icon} color="black" className="w-6 h-6" />
        </div>
         <div className="flex flex-col sm:items-center">
          
         </div>
        <CardHeader className="p-0 w-full">
          <CardTitle className="mx-auto">{nameTimePrayer}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex flex-col items-center gap-1">
          <p className="text-xl font-medium tabular-nums tracking-tight">
            {timePrayer}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
