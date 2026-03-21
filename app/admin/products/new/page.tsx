import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createProductAction } from "@/actions/products";
import ProductForm from "@/components/products/ProductForm";
import { connection } from "next/server";

export const metadata: Metadata = { title: "Admin — Nuevo producto" };

export default async function NewProductPage() {
  await connection();
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-sm text-muted hover:text-gray-900">
          ← Productos
        </Link>
        <span className="text-muted">/</span>
        <h1 className="text-xl font-bold text-gray-900">Nuevo producto</h1>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 max-w-2xl">
        <ProductForm
          action={createProductAction}
          categories={categories}
          submitLabel="Crear producto"
        />
      </div>
    </div>
  );
}
