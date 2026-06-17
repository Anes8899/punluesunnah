const monthIslam = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Ula",
  "Jumada al-Thani",
  "Rajab",
  "Shaban",
  "Ramadan",
  "Shawwal",
  "Dhul Qadah",
  "Dhul Hijjah",
];

export function getHijriDate(date: Date = new Date()): string {
  const adjusted = new Date(date);
  adjusted.setDate(adjusted.getDate() - 1);
  const parts = new Intl.DateTimeFormat(
    ["en-u-ca-islamic-umalqura", "en-u-ca-islamic-civil", "en-u-ca-islamic"],
    {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    },
  ).formatToParts(adjusted);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  const day = get("day");
  const monthIndex = parseInt(get("month")) - 1; // 0-based
  const year = get("year");
  const month = monthIslam[monthIndex];

  return `${day} ${month} ${year}`;
}
