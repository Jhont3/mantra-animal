import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CreateCategoryForm, DeleteCategoryForm } from "@/components/admin/CategoryForms";
import type { Category } from "@prisma/client";
import { connection } from "next/server";

export const metadata: Metadata = { title: "Admin — Categorías" };

type CategoryRow = Category & { _count: { products: number } };

export default async function AdminCategoriesPage() {
  await connection();
  let categories: CategoryRow[] = [];
  try {
    categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  } catch (err) {
    console.warn("⚠️ Database not reachable. Loaded skeletons and fallback mocks.");
    await new Promise((r) => setTimeout(r, 1200)); // Artificial delay to preview skeletons
    categories = [
       { id: "mock-1", name: "Alimento Gatos", slug: "alimento-gatos", _count: { products: 12 } },
       { id: "mock-2", name: "Accesorios Perros", slug: "accesorios-perros", _count: { products: 0 } },
       { id: "mock-3", name: "Medicamentos", slug: "medicamentos", _count: { products: 5 } }
    ] as CategoryRow[];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categorías</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create form */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Nueva categoría</h2>
          <CreateCategoryForm />
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
                    <DeleteCategoryForm id={cat.id} productCount={cat._count.products} />
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
