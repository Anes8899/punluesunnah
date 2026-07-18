interface VerseListProps {
  showBismillah?: boolean;
  text_uthmani: string;
  verse_number: number;
}

const ARABIC_INDIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

function toArabicIndicDigits(value: number): string {
  return String(value).replace(/[0-9]/g, (digit) => ARABIC_INDIC_DIGITS[Number(digit)]);
}

export default function VerseList({
  showBismillah,
  text_uthmani,
  verse_number,
}: VerseListProps) {
  return (
    <>
      {/* {showBismillah && (
        <p className="font-arabic mt-6 border-b border-slate-100 pb-6 text-center text-2xl text-slate-700">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </p>
      )} */}

      <div className="font-arabic text-right text-2xl leading-loose text-slate-800">
        <div className="flex items-center justify-end">
          {text_uthmani}
          <span className="font-lateef mx-1.5 align-middle text-3xl text-[#00966b]">
            &#1757;<span>{toArabicIndicDigits(verse_number)}</span>
          </span>
        </div>
      </div>
    </>
  );
}
