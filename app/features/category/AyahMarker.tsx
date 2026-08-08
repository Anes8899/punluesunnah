import { toArabicIndicDigits } from "@/lib/arabicDigits";

export default function AyahMarker({ number }: { number: number }) {
  return (
    <span className="font-lateef align-middle text-2xl text-[#00966b] md:text-4xl">
      &#1757;<span>{toArabicIndicDigits(number)}</span>
    </span>
  );
}
