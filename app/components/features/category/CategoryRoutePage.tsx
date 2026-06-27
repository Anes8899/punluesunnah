interface CategoryRoutePageProps {
  title: string;
}

export default function CategoryRoutePage({ title }: CategoryRoutePageProps) {
  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-[#00966b]">មាតិកា</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-800">{title}</h1>
      <p className="mt-3 text-sm text-slate-500">កំពុងរៀបចំមាតិកា</p>
    </section>
  );
}
