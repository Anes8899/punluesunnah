"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/app/ui/sheet";
import { CONTENT_NAV, OVERVIEW, type NavItem } from "./nav";

function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === href : pathname.startsWith(href);
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const active = isActive(pathname, item.href);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
      )}
    >
      <Icon className="size-4 shrink-0" aria-hidden />
      {item.label}
    </Link>
  );
}

function NavList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      <NavLink item={OVERVIEW} pathname={pathname} onNavigate={onNavigate} />
      <p className="text-sidebar-foreground/50 mt-4 mb-1 px-3 text-xs">មាតិកា</p>
      {CONTENT_NAV.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile */}
      <div className="bg-sidebar border-sidebar-border sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="បើកម៉ឺនុយ">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-sidebar w-72 p-0">
            <SheetTitle className="text-sidebar-foreground px-6 pt-6 text-base">
              ផ្ទាំងគ្រប់គ្រង
            </SheetTitle>
            <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="text-sidebar-foreground font-bold">ពន្លឺស៊ុណ្ណះ</span>
      </div>

      {/* Desktop */}
      <aside className="bg-sidebar border-sidebar-border hidden w-64 shrink-0 border-r md:block">
        <div className="sticky top-0">
          <Link
            href="/"
            className="text-sidebar-foreground block px-6 pt-6 pb-2 font-bold"
          >
            ពន្លឺស៊ុណ្ណះ
          </Link>
          <p className="text-sidebar-foreground/50 px-6 pb-2 text-xs">
            ផ្ទាំងគ្រប់គ្រងមាតិកា
          </p>
          <NavList pathname={pathname} />
        </div>
      </aside>
    </>
  );
}
