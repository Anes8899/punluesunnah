import Link from "next/link";
import { notFound } from "next/navigation";
import DuaCard from "@/app/features/category/DuaCard";
import { DUAS, DUA_CATEGORIES } from "@/app/features/category/duaData";
import {
  getCategoryBySlug,
  getCategoryMeta,
} from "@/app/features/category/duaCategoryMeta";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/ui/breadcrumb";

export function generateStaticParams() {
  return DUA_CATEGORIES.map((cat) => ({ slug: getCategoryMeta(cat).slug }));
}

export default async function DuaCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const duas = DUAS.filter((dua) => dua.category === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Breadcrumb className="mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">ទំព័រដើម</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dua">ទូអាទាំងអស់</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <p className="font-arabic text-center text-3xl text-amber-ink">الدُّعَاء</p>

      <div className="mt-1 mb-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">{category}</h1>
        <p className="text-sm text-ink-muted">{duas.length} ទូអា</p>
      </div>

      <section className="rounded-3xl bg-surface-soft/60 p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {duas.map((dua) => (
            <DuaCard key={dua.id} dua={dua} />
          ))}
        </div>

        {duas.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-muted">
            មិនមានទូអាក្នុងប្រភេទនេះទេ
          </p>
        )}
      </section>
    </div>
  );
}
