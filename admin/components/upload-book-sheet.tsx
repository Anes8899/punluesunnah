"use client"

import { useActionState, useState } from "react"
import { Upload } from "lucide-react"

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

export function UploadBookSheet({ category, title }: { category: BookCategory; title: string }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState<UploadState, FormData>(async (_prev, formData) => {
    const result = await uploadBook(category, formData)
    if (result.ok) setOpen(false)
    return result
  }, { ok: false })

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
