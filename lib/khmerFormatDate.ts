const toKhmerNumeral = (num: number): string => {
  const khmerDigits = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  return String(num)
    .split("")
    .map((d) => khmerDigits[parseInt(d)])
    .join("");
};

const KHMER_MONTHS = [
  "មករា",
  "កុម្ភៈ",
  "មីនា",
  "មេសា",
  "ឧសភា",
  "មិថុនា",
  "កក្កដា",
  "សីហា",
  "កញ្ញា",
  "តុលា",
  "វិច្ឆិកា",
  "ធ្នូ",
];

export function formatKhmerDate(date: Date): string {
  const day = toKhmerNumeral(date.getDate());
  const month = KHMER_MONTHS[date.getMonth()];
  const year = toKhmerNumeral(date.getFullYear());

  return `ថ្ងៃទី${day} ខែ${month} ឆ្នាំ${year}`;
}
