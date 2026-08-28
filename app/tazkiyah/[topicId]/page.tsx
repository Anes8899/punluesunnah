import Link from "next/link";
import { notFound } from "next/navigation";
import LessonContent, {
  type ContentBlock,
} from "@/app/components/LessonContent";
import {
  TAZKIYAH_TOPICS,
  getTazkiyahTopic,
} from "@/app/features/category/tazkiyahData";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/ui/breadcrumb";

export function generateStaticParams() {
  return TAZKIYAH_TOPICS.map((topic) => ({ topicId: topic.id }));
}

export default async function TazkiyahTopicPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = getTazkiyahTopic(topicId);

  if (!topic) {
    notFound();
  }

  const content: ContentBlock[] = [
    { type: "text", text: topic.short },
    { type: "divider", text: topic.kicker },
    ...topic.entries.map((entry) => ({
      type: "evidence" as const,
      kind: entry.type,
      arabic: entry.arabic,
      source: entry.reference,
      translation: entry.khmer,
    })),
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
              <Link href="/tazkiyah">ប្រធានបទទាំងអស់</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{topic.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <p className="font-arabic text-center text-3xl text-amber-ink lg:text-4xl">
        {topic.arabic}
      </p>
      <h1 className="mt-1 mb-6 text-2xl font-bold text-ink sm:text-3xl lg:mb-8 lg:text-4xl">
        {topic.title}
      </h1>

      {topic.entries.length > 0 ? (
        <LessonContent content={content} />
      ) : (
        <p className="py-10 text-center text-sm text-ink-muted">
          មិនទាន់មានខ្លឹមសារទេ
        </p>
      )}
    </div>
  );
}
