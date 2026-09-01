import type { Metadata } from "next";
import { Toaster } from "@/app/ui/sonner";
import AdminSidebar from "./_components/AdminSidebar";

export const metadata: Metadata = {
  title: "ផ្ទាំងគ្រប់គ្រង · ពន្លឺស៊ុណ្ណះ",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
