const ARABIC_INDIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicIndicDigits(value: number): string {
  return String(value).replace(
    /[0-9]/g,
    (digit) => ARABIC_INDIC_DIGITS[Number(digit)],
  );
}
