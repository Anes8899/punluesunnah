import Link from "next/link";
import { Card, CardContent } from "@/app/ui/card";
import AdminHeader from "./_components/AdminHeader";
import { CONTENT_NAV } from "./_components/nav";
import { getStats } from "@punluesunnah/api-client/content";

export default async function AdminOverviewPage() {
  const stats = await getStats();

  const counts: Record<string, number> = {
    "/books": stats.books,
    "/ustaz": stats.ustaz,
    "/dua": stats.duas,
    "/hadith": stats.hadiths,
    "/khutbah": stats.khutbahs,
    "/tazkiyah": stats.tazkiyah,
    "/akhlaq": stats.akhlaq,
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
            សៀវភៅសរុប <strong className="font-numeral">{stats.books}</strong> ក្នុងនោះមានមេរៀន{" "}
            <strong className="font-numeral">{stats.lessons}</strong>
          </p>
        </CardContent>
      </Card>
    </>
  );
}
