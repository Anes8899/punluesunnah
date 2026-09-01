"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import type { Book, ContentBlock, Lesson } from "@/app/admin/_data/books";
import { Button } from "@/app/ui/button";
import { Card, CardContent } from "@/app/ui/card";
import { Input } from "@/app/ui/input";
import Field from "@/app/admin/_components/Field";
import { reportUnsaved } from "@/app/admin/_components/unsaved";
import BlockList from "./BlockList";

export default function LessonEditor({
  book,
  lesson,
}: {
  book: Book;
  lesson: Lesson;
}) {
  const [khmerTitle, setKhmerTitle] = useState(lesson.khmer_title);
  const [arabicTitle, setArabicTitle] = useState(lesson.arabic_title);
  const [blocks, setBlocks] = useState<ContentBlock[]>(lesson.content);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    reportUnsaved(`lesson:${book.key}:${lesson.id}`, {
      bookKey: book.key,
      subject: book.subject,
      id: lesson.id,
      khmer_title: khmerTitle,
      arabic_title: arabicTitle,
      content: blocks,
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/books/${book.key}`}>
            <ArrowLeft className="size-4" />
            {book.khmer_title}
          </Link>
        </Button>
        <Button type="submit">
          <Save className="size-4" />
          រក្សាទុក
        </Button>
      </div>

      <Card>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field label="ចំណងជើងខ្មែរ" htmlFor="khmer_title">
            <Input
              id="khmer_title"
              value={khmerTitle}
              onChange={(e) => setKhmerTitle(e.target.value)}
            />
          </Field>
          <Field label="ចំណងជើងអារ៉ាប់" htmlFor="arabic_title">
            <Input
              id="arabic_title"
              dir="rtl"
              className="font-arabic"
              value={arabicTitle}
              onChange={(e) => setArabicTitle(e.target.value)}
            />
          </Field>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 font-bold">
          ខ្លឹមសារមេរៀន{" "}
          <span className="text-muted-foreground font-numeral text-sm font-normal">
            ({blocks.length})
          </span>
        </h2>
        <BlockList blocks={blocks} onChange={setBlocks} />
      </div>
    </form>
  );
}
