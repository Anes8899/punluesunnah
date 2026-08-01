interface PageHeaderProps {
  eyebrow: string;
  title: string;
  arabic: string;
  description: string;
}

export default function PageHeader({
  eyebrow,
  title,
  arabic,
  description,
}: PageHeaderProps) {
  return (
    <header className="text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#00966b]">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-800 sm:text-4xl">
        {title}
      </h1>
      <p className="font-arabic mt-2 text-2xl text-[#00966b]">{arabic}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
        {description}
      </p>
    </header>
  );
}
