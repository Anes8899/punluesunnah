import Link from "next/link";
import { notFound } from "next/navigation";
import LessonContent, {
  type ContentBlock,
} from "@/app/components/LessonContent";
import {
  AKHLAQ_VIRTUES,
  getAkhlaqVirtue,
} from "@/app/features/category/akhlaqData";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/ui/breadcrumb";

export function generateStaticParams() {
  return AKHLAQ_VIRTUES.map((virtue) => ({ virtueId: virtue.id }));
}

export default async function AkhlaqVirtuePage({
  params,
}: {
  params: Promise<{ virtueId: string }>;
}) {
  const { virtueId } = await params;
  const virtue = getAkhlaqVirtue(virtueId);

  if (!virtue) {
    notFound();
  }

  const content: ContentBlock[] = [
    { type: "callout", text: virtue.short },
    { type: "text", text: virtue.long },
    { type: "divider", text: "ឯកសារយោង" },
    ...virtue.refs.map(
      (ref): ContentBlock => ({
        type: "evidence",
        kind: /\d+:\d+/.test(ref.source) ? "quran" : "hadith",
        arabic: ref.arabic,
        source: ref.source,
        translation: ref.khmer.replace(/^"|"$/g, ""),
      }),
    ),
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
              <Link href="/akhlaq">សីលធម៌ទាំងអស់</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{virtue.kicker}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <p className="font-arabic text-center text-3xl text-amber-ink lg:text-4xl">
        {virtue.arabic}
      </p>
      <h1 className="mt-1 mb-6 text-2xl font-bold text-ink sm:text-3xl lg:mb-8 lg:text-4xl">
        {virtue.kicker}
      </h1>

      <LessonContent content={content} />
    </div>
  );
}
