import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteProductFormAction } from "@/actions/products";
import type { Product } from "@prisma/client";
import type { Category } from "@prisma/client";
import { connection } from "next/server";

export const metadata: Metadata = { title: "Admin — Productos" };

type ProductRow = Product & { category: Category };

export default async function AdminProductsPage() {
  await connection();
  const products: ProductRow[] = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos ({products.length})</h1>
        <Link href="/admin/products/new" className="btn-primary">
          + Nuevo producto
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-border text-left">
              <th className="px-4 py-3 font-semibold text-gray-700">Producto</th>
              <th className="px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">Categoría</th>
              <th className="px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Precio</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Estado</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface shrink-0">
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-muted">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted hidden sm:table-cell">{p.category.name}</td>
                <td className="px-4 py-3 font-medium hidden md:table-cell">
                  ${p.price.toLocaleString("es-CO")}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {p.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-primary hover:underline text-xs font-medium"
                    >
                      Editar
                    </Link>
                    <form action={deleteProductFormAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="text-danger hover:underline text-xs font-medium"
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p>
              No hay productos.{" "}
              <Link href="/admin/products/new" className="text-primary hover:underline">
                Crea el primero
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
