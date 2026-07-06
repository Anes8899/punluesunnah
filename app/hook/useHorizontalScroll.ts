'use client'
import { useEffect, useRef, useState } from "react";

export function useHorizontalScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () =>
      setIsOverflowing(el.scrollWidth > el.clientWidth);

    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  }

  return { scrollRef, scroll, isOverflowing };
}
