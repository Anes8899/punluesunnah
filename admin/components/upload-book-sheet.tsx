"use client"

import { useActionState, useState } from "react"
import { Plus, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { uploadBook, type UploadState } from "@/lib/actions"
import type { BookCategory } from "@/lib/api"

type ChapterDraft = { title: string; content: string }

export function UploadBookSheet({ category, title }: { category: BookCategory; title: string }) {
  const [open, setOpen] = useState(false)
  const [chapters, setChapters] = useState<ChapterDraft[]>([])
  const [state, action, pending] = useActionState<UploadState, FormData>(async (_prev, formData) => {
    const result = await uploadBook(category, formData)
    if (result.ok) {
      setOpen(false)
      setChapters([])
    }
    return result
  }, { ok: false })

  const updateChapter = (index: number, patch: Partial<ChapterDraft>) =>
    setChapters((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)))

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        <Upload />
        Upload book
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Upload {title} book</SheetTitle>
          <SheetDescription>Add a book to the {title} library.</SheetDescription>
        </SheetHeader>

        <form action={action} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <Field label="Title" htmlFor="title">
            <Input id="title" name="title" required />
          </Field>
          <Field label="Author" htmlFor="author">
            <Input id="author" name="author" />
          </Field>
          <Field label="Cover image" htmlFor="cover" hint="JPG, PNG or WebP">
            <Input id="cover" name="cover" type="file" accept="image/jpeg,image/png,image/webp" />
          </Field>
          <Field label="Book file" htmlFor="file" hint="PDF, up to 50 MB">
            <Input id="file" name="file" type="file" accept="application/pdf" />
          </Field>

          {/* The API reads chapters as a JSON string; array order is chapter order. */}
          <input type="hidden" name="chapters" value={JSON.stringify(chapters)} />
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium">Chapters</span>
            {chapters.map((chapter, i) => (
              <div key={i} className="flex flex-col gap-2 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{i + 1}.</span>
                  <Input
                    aria-label={`Chapter ${i + 1} title`}
                    placeholder="Chapter title"
                    value={chapter.title}
                    onChange={(e) => updateChapter(i, { title: e.target.value })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove chapter ${i + 1}`}
                    onClick={() => setChapters((prev) => prev.filter((_, j) => j !== i))}
                  >
                    <X />
                  </Button>
                </div>
                <textarea
                  aria-label={`Chapter ${i + 1} content`}
                  placeholder="Chapter content (one paragraph per line)"
                  value={chapter.content}
                  onChange={(e) => updateChapter(i, { content: e.target.value })}
                  rows={5}
                  className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setChapters((prev) => [...prev, { title: "", content: "" }])}
            >
              <Plus />
              Add chapter
            </Button>
          </div>

          {state.error && <p className="text-sm text-destructive">{state.error}</p>}

          <SheetFooter className="mt-auto px-0">
            <Button type="submit" disabled={pending}>
              {pending ? "Uploading…" : "Upload"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
