"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Route } from "next";
import type { CategoryWithCount } from "@/types";

interface Props {
  categories: CategoryWithCount[];
}

export default function ProductFilters({ categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}` as Route, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const activeCategory = searchParams.get("category") ?? "";
  const activeSpecies  = searchParams.get("species")  ?? "";
  const activeSearch   = searchParams.get("q")        ?? "";

  return (
    <aside className="w-full lg:w-56 shrink-0 space-y-5">
      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
          Buscar
        </label>
        <div className="relative flex items-center">
          <input
            type="search"
            defaultValue={activeSearch}
            placeholder="Nombre del producto…"
            onChange={(e) => updateParam("q", e.target.value || null)}
            className="w-full border-2 border-primary/30 rounded-xl pl-3 pr-11 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
          />
          <span className="absolute right-1.5 flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
          Categoría
        </p>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateParam("category", null)}
              className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors ${!activeCategory ? "bg-primary text-white" : "hover:bg-surface text-gray-700"}`}
            >
              Todas
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => updateParam("category", cat.slug)}
                className={`w-full text-left text-sm px-2 py-1.5 rounded-md transition-colors flex justify-between items-center ${activeCategory === cat.slug ? "bg-primary text-white" : "hover:bg-surface text-gray-700"}`}
              >
                <span>{cat.name}</span>
                <span className={`text-xs ${activeCategory === cat.slug ? "text-white/70" : "text-muted"}`}>
                  {cat._count.products}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Species */}
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
          Especie
        </p>
        <div className="flex gap-2">
          {[
            { value: "", label: "Todos" },
            { value: "dog", label: "🐶 Perro" },
            { value: "cat", label: "🐱 Gato" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam("species", opt.value || null)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${activeSpecies === opt.value ? "border-primary bg-primary text-white" : "border-border hover:border-primary text-gray-700"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {(activeCategory || activeSpecies || activeSearch) && (
        <button
          onClick={() => router.push(pathname as Route)}
          className="text-sm text-danger hover:underline"
        >
          Limpiar filtros
        </button>
      )}
    </aside>
  );
}
