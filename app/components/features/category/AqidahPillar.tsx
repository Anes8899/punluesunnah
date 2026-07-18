interface AqidahPillarProps {
  number: number;
  title: string;
  arabic?: string;
  transliteration?: string;
  description: string;
  citation?: string;
}

export default function AqidahPillar({
  number,
  title,
  arabic,
  transliteration,
  description,
  citation,
}: AqidahPillarProps) {
  return (
    <div className="flex gap-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#00966b]/10 text-sm font-semibold text-[#00966b]">
        {number}
      </div>

      <div className="min-w-0">
        <h3 className="text-base font-semibold text-slate-800">
          {title}
          {transliteration && (
            <span className="ml-1.5 text-sm font-normal italic text-slate-400">
              — {transliteration}
            </span>
          )}
          {arabic && (
            <span className="font-arabic ml-2 text-lg text-[#00966b]">
              {arabic}
            </span>
          )}
        </h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        {citation && (
          <p className="mt-1 text-xs text-slate-400">{citation}</p>
        )}
      </div>
    </div>
  );
}
