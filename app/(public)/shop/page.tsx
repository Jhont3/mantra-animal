import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/auth";
import { getUserFavoriteIds } from "@/actions/favorites";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import type { Species } from "@prisma/client";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Productos veterinarios para perros y gatos. Entrega en 1–2 días en Medellín.",
};

interface SearchParams {
  category?: string;
  species?: string;
  q?: string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await connection();
  const params = await searchParams;

  const [categories, user] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: { where: { active: true } } } } },
      orderBy: { name: "asc" },
    }),
    getCurrentUser(),
  ]);

  const favoriteIds = user ? await getUserFavoriteIds(user.id) : [];

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(params.category && { category: { slug: params.category } }),
      ...(params.species && { species: { has: params.species as Species } }),
      ...(params.q && { name: { contains: params.q, mode: "insensitive" } }),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tienda</h1>
        <p className="text-muted mt-1 text-sm">
          {products.length} {products.length === 1 ? "producto" : "productos"} disponibles
        </p>
      </div>

      {/* Mock payment banner */}
      <div className="mb-6 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800 text-center">
        💳 Pagos en línea próximamente. Por ahora, escríbenos por WhatsApp.
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <Suspense fallback={<div className="w-56 shrink-0 h-64 bg-surface rounded-xl animate-pulse" />}>
          <ProductFilters categories={categories} />
        </Suspense>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid
            products={products}
            favoriteIds={favoriteIds}
            userId={user?.id}
          />
        </div>
      </div>
    </div>
  );
}
