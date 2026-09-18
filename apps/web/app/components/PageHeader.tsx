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
  // The four lines arrive in reading order rather than as one block, which
  // gives the page a beat before the content below it staggers in.
  return (
    <header className="text-center">
      <p className="motion-rise text-xs font-semibold uppercase tracking-[0.14em] text-[#00966b]">
        {eyebrow}
      </p>
      <h1
        className="motion-rise mt-2 text-3xl font-bold text-slate-800 sm:text-4xl"
        style={{ "--motion-delay": "70ms" } as React.CSSProperties}
      >
        {title}
      </h1>
      <p
        className="font-arabic motion-blur-in mt-2 text-2xl text-[#00966b]"
        style={{ "--motion-delay": "140ms" } as React.CSSProperties}
      >
        {arabic}
      </p>
      <p
        className="motion-rise mx-auto mt-3 max-w-xl text-sm text-slate-500"
        style={{ "--motion-delay": "210ms" } as React.CSSProperties}
      >
        {description}
      </p>
    </header>
  );
}
