"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { ContentBlock, Tone } from "@/app/admin/_data/books";
import { BLOCK_TYPES } from "@/app/admin/_data/books";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import { Textarea } from "@/app/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/ui/select";
import Field from "@/app/admin/_components/Field";
import { BLOCK_LABEL, emptyBlock } from "./blockDefaults";

const TONES: Tone[] = ["highlight", "success"];
const NONE = "__none__";

export default function BlockList({
  blocks,
  onChange,
  /** `section` blocks nest one level; nested lists cannot nest further. */
  nested = false,
}: {
  blocks: ContentBlock[];
  onChange: (next: ContentBlock[]) => void;
  nested?: boolean;
}) {
  const [adding, setAdding] = useState<ContentBlock["type"]>("text");

  const update = (index: number, block: ContentBlock) =>
    onChange(blocks.map((b, i) => (i === index ? block : b)));

  const remove = (index: number) =>
    onChange(blocks.filter((_, i) => i !== index));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved!);
    onChange(next);
  };

  const addable = nested
    ? BLOCK_TYPES.filter((t) => t !== "section")
    : BLOCK_TYPES;

  return (
    <div className="flex flex-col gap-3">
      {blocks.map((block, index) => (
        <div key={index} className="bg-card rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-muted-foreground text-xs font-bold">
              {index + 1}. {BLOCK_LABEL[block.type]}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`ផ្លាស់ទីឡើងលើ ${index + 1}`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ChevronUp className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`ផ្លាស់ទីចុះក្រោម ${index + 1}`}
                disabled={index === blocks.length - 1}
                onClick={() => move(index, 1)}
              >
                <ChevronDown className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`លុបប្លុក ${index + 1}`}
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          <BlockFields
            block={block}
            onChange={(next) => update(index, next)}
          />
        </div>
      ))}

      <div className="flex items-center gap-2">
        <Select
          value={adding}
          onValueChange={(v) => setAdding(v as ContentBlock["type"])}
        >
          <SelectTrigger className="w-48" aria-label="ប្រភេទប្លុក">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {addable.map((t) => (
              <SelectItem key={t} value={t}>
                {BLOCK_LABEL[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange([...blocks, emptyBlock(adding)])}
        >
          <Plus className="size-4" />
          បន្ថែមប្លុក
        </Button>
      </div>
    </div>
  );
}

function ToneSelect({
  value,
  onChange,
}: {
  value: Tone | undefined;
  onChange: (tone: Tone | undefined) => void;
}) {
  return (
    <Field label="ពណ៌សំឡេង">
      <Select
        value={value ?? NONE}
        onValueChange={(v) => onChange(v === NONE ? undefined : (v as Tone))}
      >
        <SelectTrigger aria-label="ពណ៌សំឡេង">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>គ្មាន</SelectItem>
          {TONES.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

function BlockFields({
  block,
  onChange,
}: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
}) {
  switch (block.type) {
    case "text":
      return (
        <Field label="អត្ថបទ">
          <Textarea
            rows={3}
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
          />
        </Field>
      );

    case "divider":
      return (
        <Field label="ចំណងជើងបន្ទាត់ខណ្ឌ">
          <Input
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
          />
        </Field>
      );

    case "definition":
      return (
        <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
          <Field label="ស្លាក">
            <Input
              value={block.label}
              onChange={(e) => onChange({ ...block, label: e.target.value })}
            />
          </Field>
          <Field label="អត្ថបទ">
            <Textarea
              rows={3}
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
            />
          </Field>
        </div>
      );

    case "callout":
      return (
        <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
          <Field label="អត្ថបទ">
            <Textarea
              rows={3}
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
            />
          </Field>
          <ToneSelect
            value={block.tone}
            onChange={(tone) => onChange({ ...block, tone })}
          />
        </div>
      );

    case "evidence":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="ប្រភេទ">
            <Select
              value={block.kind}
              onValueChange={(v) =>
                onChange({ ...block, kind: v as "quran" | "hadith" })
              }
            >
              <SelectTrigger aria-label="ប្រភេទភស្តុតាង">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quran">គួរអាន</SelectItem>
                <SelectItem value="hadith">ហាទីស</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="សេចក្តីផ្តើម">
            <Input
              value={block.intro ?? ""}
              onChange={(e) =>
                onChange({ ...block, intro: e.target.value || undefined })
              }
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="អារ៉ាប់">
              <Textarea
                rows={3}
                dir="rtl"
                className="font-arabic text-lg"
                value={block.arabic}
                onChange={(e) => onChange({ ...block, arabic: e.target.value })}
              />
            </Field>
          </div>
          <Field label="ប្រភព">
            <Input
              value={block.source ?? ""}
              onChange={(e) =>
                onChange({ ...block, source: e.target.value || undefined })
              }
            />
          </Field>
          <Field label="ប្រភពការបកប្រែ">
            <Input
              value={block.translation_source ?? ""}
              onChange={(e) =>
                onChange({
                  ...block,
                  translation_source: e.target.value || undefined,
                })
              }
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="ការបកប្រែ">
              <Textarea
                rows={3}
                value={block.translation ?? ""}
                onChange={(e) =>
                  onChange({
                    ...block,
                    translation: e.target.value || undefined,
                  })
                }
              />
            </Field>
          </div>
        </div>
      );

    case "section":
      return (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_120px_200px]">
            <Field label="ចំណងជើងផ្នែក">
              <Input
                value={block.title}
                onChange={(e) => onChange({ ...block, title: e.target.value })}
              />
            </Field>
            <Field label="លេខ">
              <Input
                value={block.number ?? ""}
                onChange={(e) =>
                  onChange({ ...block, number: e.target.value || undefined })
                }
              />
            </Field>
            <ToneSelect
              value={block.tone}
              onChange={(tone) => onChange({ ...block, tone })}
            />
          </div>
          <div className="border-l-2 pl-4">
            <p className="text-muted-foreground mb-2 text-xs">
              ប្លុករងក្នុងផ្នែក
            </p>
            <BlockList
              blocks={block.blocks}
              onChange={(blocks) => onChange({ ...block, blocks })}
              nested
            />
          </div>
        </div>
      );
  }
}
