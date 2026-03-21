import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { createCategoryFormAction, deleteCategoryFormAction } from "@/actions/categories";
import type { Category } from "@prisma/client";
import { connection } from "next/server";

export const metadata: Metadata = { title: "Admin — Categorías" };

type CategoryRow = Category & { _count: { products: number } };

export default async function AdminCategoriesPage() {
  await connection();
  const categories: CategoryRow[] = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categorías</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create form */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Nueva categoría</h2>
          <form action={createCategoryFormAction} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre (visible al usuario)
              </label>
              <input
                name="name"
                required
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Concentrados / Comida"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL)
              </label>
              <input
                name="slug"
                required
                pattern="[a-z0-9-]+"
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="food"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Crear categoría
            </button>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-border text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Slug</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Productos</th>
                <th className="px-4 py-3 font-semibold text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                  <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-4 py-3 text-muted font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-muted">{cat._count.products}</td>
                  <td className="px-4 py-3">
                    <form action={deleteCategoryFormAction}>
                      <input type="hidden" name="id" value={cat.id} />
                      <button
                        type="submit"
                        disabled={cat._count.products > 0}
                        className="text-danger hover:underline text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                        title={cat._count.products > 0 ? "Elimina los productos primero" : ""}
                      >
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <p className="text-center py-8 text-muted text-sm">No hay categorías aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}
