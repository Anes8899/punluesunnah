import { Clock } from "lucide-react";

export default function CountdownPill({
  countdown,
  size,
}: {
  countdown: string;
  size: "sm" | "md";
}) {
  return (
    <div
      className={`inline-flex items-center gap-[9px] rounded-full bg-white/15 ${
        size === "sm" ? "px-[15px] py-2" : "px-4 py-[9px]"
      }`}
    >
      <Clock
        strokeWidth={2.75}
        className={size === "sm" ? "w-[15px] h-[15px]" : "w-4 h-4"}
      />
      <span
        className={`font-black tabular-nums text-white ${
          size === "sm" ? "text-[17px]" : "text-xl"
        }`}
      >
        {countdown}
      </span>
    </div>
  );
}
