interface CategoryRoutePageProps {
  title: string;
}

export default function CategoryRoutePage({ title }: CategoryRoutePageProps) {
  return (
    <section className="rounded-lg bg-card p-6 shadow-sm">
      <p className="text-sm font-medium text-brand">មាតិកា</p>
      <h1 className="mt-2 text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-3 text-sm text-ink-muted">កំពុងរៀបចំមាតិកា</p>
    </section>
  );
}
