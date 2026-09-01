import Link from "next/link";
import { Card, CardContent } from "@/app/ui/card";
import AdminHeader from "./_components/AdminHeader";
import { CONTENT_NAV } from "./_components/nav";
import { countLessons, listBooks } from "./_data/books";
import { listUstaz } from "./_data/ustaz";
import { listDuas } from "./_data/dua";
import { listHadiths } from "./_data/hadith";
import { listKhutbahs } from "./_data/khutbah";
import { listTazkiyah } from "./_data/tazkiyah";
import { listAkhlaq } from "./_data/akhlaq";

export default async function AdminOverviewPage() {
  const [books, lessons, ustaz, duas, hadiths, khutbahs, tazkiyah, akhlaq] =
    await Promise.all([
      listBooks(),
      countLessons(),
      listUstaz(),
      listDuas(),
      listHadiths(),
      listKhutbahs(),
      listTazkiyah(),
      listAkhlaq(),
    ]);

  const counts: Record<string, number> = {
    "/admin/books": books.length,
    "/admin/ustaz": ustaz.length,
    "/admin/dua": duas.length,
    "/admin/hadith": hadiths.length,
    "/admin/khutbah": khutbahs.length,
    "/admin/tazkiyah": tazkiyah.length,
    "/admin/akhlaq": akhlaq.length,
  };

  return (
    <>
      <AdminHeader
        title="ផ្ទាំងគ្រប់គ្រង"
        description="ទិដ្ឋភាពរួមនៃមាតិកាទាំងអស់"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTENT_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="group">
              <Card className="hover:border-primary/40 h-full transition-colors">
                <CardContent className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">{item.label}</p>
                    <p className="font-numeral mt-1 text-3xl font-bold">
                      {counts[item.href] ?? 0}
                    </p>
                  </div>
                  <Icon
                    className="text-muted-foreground group-hover:text-primary size-8 transition-colors"
                    aria-hidden
                  />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardContent>
          <p className="text-sm">
            សៀវភៅសរុប <strong className="font-numeral">{books.length}</strong> ក្នុងនោះមានមេរៀន{" "}
            <strong className="font-numeral">{lessons}</strong>
          </p>
          <p className="text-muted-foreground mt-2 text-xs">
            ទិន្នន័យអានពីឯកសារដើមក្នុងកូដ — ការកែសម្រួលមិនទាន់រក្សាទុកនៅឡើយទេ។
          </p>
        </CardContent>
      </Card>
    </>
  );
}
