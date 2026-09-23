"use client";

import Image from "next/image";
import Link, { useLinkStatus } from "next/link";
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

/**
 * Underline that fills while the clicked link's route is still loading. Must
 * render inside a <Link>; a fixed-size element that only changes scale, so a
 * pending navigation never shifts the bar's layout.
 */
function LinkPending() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={cn(
        "absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-brand transition-transform duration-500 ease-out",
        pending ? "scale-x-100" : "scale-x-0",
      )}
    />
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile sheet whenever the route changes. Adjusting during render
  // rather than in an effect — the sheet is derived from the route, so this
  // avoids a second pass that would paint the menu over the new page first.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  // The bar gains a shadow and tightens once the page moves under it. The
  // first read is deferred to a frame so mount stays a single render pass;
  // it still catches a restored scroll position on a back navigation.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-page/85 backdrop-blur transition-[box-shadow,background-color,border-color] duration-300 supports-[backdrop-filter]:bg-page/70",
        scrolled
          ? "border-surface-border shadow-[0_6px_20px_-12px_rgba(32,30,29,0.45)]"
          : "border-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 transition-[padding] duration-300",
          scrolled ? "py-2" : "py-3",
        )}
      >
        <Link href="/" className="group flex w-fit items-center gap-3">
          {/* Scaled up visually — the 44px box keeps the bar from growing taller. */}
          <Image
            src="/assets/icon/logo.png"
            alt="The Light Of Sunnah logo"
            width={128}
            height={128}
            priority
            className="mr-4 size-11 origin-left scale-150 object-contain transition-transform duration-500 ease-out group-hover:scale-[1.65] group-hover:-rotate-3"
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
                "press relative rounded-full px-3 py-2 text-sm leading-relaxed transition-colors duration-300",
                isActive(link.href)
                  ? "bg-brand/10 font-bold text-brand"
                  : "text-ink-muted hover:bg-surface-soft hover:text-ink",
              )}
            >
              {link.label}
              <LinkPending />
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="navbar-mobile-menu"
          aria-label={open ? "បិទម៉ឺនុយ" : "បើកម៉ឺនុយ"}
          className="press rounded-full p-2 text-ink transition-colors hover:bg-surface-soft md:hidden"
        >
          {/* Both icons occupy the same cell and cross-rotate, so the toggle
              reads as one mark changing rather than two swapping. */}
          <span className="relative block size-5">
            <Menu
              className={cn(
                "absolute inset-0 size-5 transition-all duration-300 ease-out",
                open ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100",
              )}
            />
            <X
              className={cn(
                "absolute inset-0 size-5 transition-all duration-300 ease-out",
                open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0",
              )}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav
          id="navbar-mobile-menu"
          className="motion-rise origin-top border-t border-surface-border bg-page px-6 py-3 md:hidden"
          style={{ "--motion-dur": "220ms" } as React.CSSProperties}
        >
          <ul
            className="motion-stagger flex flex-col gap-1"
            style={
              {
                "--motion-step": "35ms",
                "--motion-delay": "60ms",
              } as React.CSSProperties
            }
          >
            {NavLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "press block rounded-md px-3 py-2 leading-relaxed transition-colors",
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
