"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

const CATEGORIES = [
  {
    label: "Alimentos",
    svg: "/imgs/food-category.svg",
    slug: "food",
    bg: "bg-accent/10 hover:bg-accent/20",
    border: "border-accent/30",
  },
  {
    label: "Medicamentos",
    svg: "/imgs/med-category.svg",
    slug: "supplement",
    bg: "bg-primary/8 hover:bg-primary/15",
    border: "border-primary/20",
  },
  {
    label: "Higiene",
    svg: "/imgs/hig-category.svg",
    slug: "hygiene",
    bg: "bg-primary-light/15 hover:bg-primary-light/25",
    border: "border-primary-light/30",
  },
  {
    label: "Accesorios",
    svg: "/imgs/accs-category.svg",
    slug: "accessories",
    bg: "bg-primary-medium/10 hover:bg-primary-medium/20",
    border: "border-primary-medium/25",
  },
  {
    label: "Antidesparasitantes",
    svg: "/imgs/desp-category.svg",
    slug: "desparasitantes",
    bg: "bg-accent/8 hover:bg-accent/18",
    border: "border-accent/25",
  },
] as const;

export default function CategoryScroller() {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        aria-label="Anterior"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-white border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
      >
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scrollable track */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 px-1 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}` as Route}
            className={`snap-start shrink-0 w-44 sm:w-48 flex flex-col items-center gap-3 rounded-2xl border ${cat.border} ${cat.bg} p-5 transition-all duration-200 group`}
          >
            <div className="w-24 h-24 flex items-center justify-center">
              <Image
                src={cat.svg}
                alt={cat.label}
                width={96}
                height={96}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-sm font-semibold text-foreground text-center leading-tight">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        aria-label="Siguiente"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-white border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
      >
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
