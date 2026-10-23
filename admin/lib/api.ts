export const API_URL = process.env.API_URL ?? "http://localhost:4000"

export type BookCategory = "aqidah" | "akhlaq"

export type Book = {
  _id: string
  category: string
  title: string
  author?: string
  coverUrl?: string
  sourceFileUrl?: string
  chapterCount: number
  createdAt: string
  updatedAt: string
}

// Uploaded files are stored as API-relative paths like /uploads/abc.pdf.
const absolute = (url?: string) => (url?.startsWith("/") ? `${API_URL}${url}` : url)

export async function getBooks(category: BookCategory): Promise<Book[]> {
  const res = await fetch(`${API_URL}/${category}`)
  if (!res.ok) throw new Error(`GET /${category} failed with ${res.status}`)
  const books: Book[] = await res.json()
  return books.map((b) => ({ ...b, coverUrl: absolute(b.coverUrl), sourceFileUrl: absolute(b.sourceFileUrl) }))
}
