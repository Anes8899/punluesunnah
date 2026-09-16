"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NavLinks = [
  { label: "គោលជំនឿ", href: "/aqidah" },
  { label: "ហ្វិកហ៍", href: "/figh" },
  { label: "អាល់គុរអាន", href: "/quran" },
  { label: "ហាទីស", href: "/hadith" },
  { label: "ទូអា", href: "/dua" },
  { label: "អ៊ូស្តើស", href: "/ustaz" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-page/85 backdrop-blur supports-[backdrop-filter]:bg-page/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex w-fit items-center gap-3">
          {/* Scaled up visually — the 44px box keeps the bar from growing taller. */}
          <Image
            src="/assets/icon/logo.png"
            alt="The Light Of Sunnah logo"
            width={128}
            height={128}
            priority
            className="mr-4 size-11 origin-left scale-150 object-contain"
          />
          <div>
            <p className="text-base font-bold leading-tight text-ink">
              The Light Of Sunnah
            </p>
            <p className="text-xs text-ink-muted">ពន្លឺ នៃ ស៊ុណ្ណះ</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-2 text-sm leading-relaxed transition-colors",
                isActive(link.href)
                  ? "bg-brand/10 font-bold text-brand"
                  : "text-ink-muted hover:bg-surface-soft hover:text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="navbar-mobile-menu"
          aria-label={open ? "បិទម៉ឺនុយ" : "បើកម៉ឺនុយ"}
          className="rounded-full p-2 text-ink transition-colors hover:bg-surface-soft md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav
          id="navbar-mobile-menu"
          className="border-t border-surface-border bg-page px-6 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-3 py-2 leading-relaxed transition-colors",
                    isActive(link.href)
                      ? "bg-brand/10 font-bold text-brand"
                      : "text-ink-muted hover:bg-surface-soft hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
