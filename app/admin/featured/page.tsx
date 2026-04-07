import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";
import FeaturedOrderManager from "@/components/admin/FeaturedOrderManager";

export const metadata: Metadata = { title: "Admin — Productos Destacados" };

export default async function AdminFeaturedPage() {
  await connection();
  const featuredProducts = await prisma.product.findMany({
    where: { featuredOrder: { not: null } },
    include: { category: true },
    orderBy: { featuredOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos Destacados</h1>
          <p className="text-sm text-muted mt-1">
            Estos productos aparecen en la pagina principal. Usa las flechas para cambiar el orden.
          </p>
        </div>
        <Link href="/admin/products" className="btn-secondary">
          Ver todos los productos
        </Link>
      </div>

      <FeaturedOrderManager products={featuredProducts} />
    </div>
  );
}
