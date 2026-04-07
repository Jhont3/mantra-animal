"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { updateFeaturedOrderAction, removeFeaturedAction } from "@/actions/products";
import { toast } from "sonner";
import type { Product, Category } from "@prisma/client";

type FeaturedProduct = Product & { category: Category };

export default function FeaturedOrderManager({
  products,
}: {
  products: FeaturedProduct[];
}) {
  const [items, setItems] = useState(products);
  const [isSaving, startSaveTransition] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setItems(next);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setItems(next);
  };

  const handleSave = () => {
    startSaveTransition(async () => {
      const result = await updateFeaturedOrderAction(items.map((p) => p.id));
      if (result.success) {
        toast.success("Orden guardado");
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleRemove = (productId: string) => {
    setRemovingId(productId);
    removeFeaturedAction(productId).then((result) => {
      setRemovingId(null);
      if (result.success) {
        setItems((prev) => prev.filter((p) => p.id !== productId));
        toast.success("Producto removido de destacados");
      } else {
        toast.error(result.error);
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <p className="mb-2">No hay productos destacados.</p>
        <Link href="/admin/products" className="text-primary hover:underline">
          Marca productos como destacados desde la lista de productos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface border-b border-border text-left">
              <th className="px-4 py-3 font-semibold text-gray-700 w-12">#</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Producto</th>
              <th className="px-4 py-3 font-semibold text-gray-700 hidden sm:table-cell">
                Categoria
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">
                Precio
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-center">Orden</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-center">Quitar</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p, index) => (
              <tr
                key={p.id}
                className="border-b border-border last:border-0 hover:bg-surface/50"
              >
                <td className="px-4 py-3 text-muted font-mono">{index + 1}</td>
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
                <td className="px-4 py-3 text-muted hidden sm:table-cell">
                  {p.category.name}
                </td>
                <td className="px-4 py-3 font-medium hidden md:table-cell">
                  ${p.price.toLocaleString("es-CO")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="px-2 py-1 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Subir"
                    >
                      &#9650;
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === items.length - 1}
                      className="px-2 py-1 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Bajar"
                    >
                      &#9660;
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleRemove(p.id)}
                    disabled={removingId === p.id}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50 text-xs font-medium"
                    title="Quitar de destacados"
                  >
                    {removingId === p.id ? "..." : "Quitar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button onClick={handleSave} disabled={isSaving} className="btn-primary">
          {isSaving ? "Guardando..." : "Guardar orden"}
        </button>
        <Link href="/admin/products" className="btn-secondary">
          Gestionar productos
        </Link>
      </div>
    </div>
  );
}
