/** "បន្ទាប់ · MAGHRIB" — the kicker above the hero time. */
export default function NextKicker({
  label,
  size,
}: {
  label: string;
  size: "sm" | "md";
}) {
  const text = size === "sm" ? "text-[11px]" : "text-xs";
  return (
    <div className="flex items-center gap-2">
      <span className={`${text} font-black tracking-[0.06em] opacity-80`}>
        បន្ទាប់
      </span>
      <span className="w-1 h-1 rounded-full bg-current opacity-50" />
      <span className={`${text} font-black tracking-[0.1em] uppercase opacity-80`}>
        {label}
      </span>
    </div>
  );
}
