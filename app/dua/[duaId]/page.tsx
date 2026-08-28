import Link from "next/link";
import { notFound } from "next/navigation";
import LessonContent, {
  type ContentBlock,
} from "@/app/components/LessonContent";
import { DUAS, getDua } from "@/app/features/category/duaData";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/ui/breadcrumb";

export function generateStaticParams() {
  return DUAS.map((dua) => ({ duaId: dua.id }));
}

export default async function DuaPage({
  params,
}: {
  params: Promise<{ duaId: string }>;
}) {
  const { duaId } = await params;
  const dua = getDua(duaId);

  if (!dua) {
    notFound();
  }

  const content: ContentBlock[] = [
    { type: "divider", text: dua.category },
    {
      type: "evidence",
      kind: "hadith",
      arabic: dua.arabic,
      source: dua.reference,
      translation: dua.khmer,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
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
            <BreadcrumbPage>{dua.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <p className="font-arabic text-center text-3xl text-amber-ink lg:text-4xl">
        {dua.arabic}
      </p>
      <h1 className="mt-1 mb-6 text-2xl font-bold text-ink sm:text-3xl lg:mb-8 lg:text-4xl">
        {dua.title}
      </h1>

      <LessonContent content={content} />
    </div>
  );
}
