"use server"

import { revalidatePath } from "next/cache"

import { API_URL, type BookCategory } from "@/lib/api"

export type UploadState = { ok: boolean; error?: string }

export async function uploadBook(category: BookCategory, formData: FormData): Promise<UploadState> {
  // An empty <input type="file"> still submits a 0-byte part, which the API would reject.
  for (const field of ["cover", "file"]) {
    const value = formData.get(field)
    if (value instanceof File && value.size === 0) formData.delete(field)
  }

  try {
    const res = await fetch(`${API_URL}/${category}`, { method: "POST", body: formData })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      return { ok: false, error: body?.error ?? `Upload failed with ${res.status}` }
    }
  } catch {
    return { ok: false, error: "Couldn't reach the back-end" }
  }

  revalidatePath(`/${category}`)
  return { ok: true }
}
