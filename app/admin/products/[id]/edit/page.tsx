import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProductAction } from "@/actions/products";
import ProductForm from "@/components/products/ProductForm";
import { connection } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, select: { name: true } });
  return { title: `Admin — Editar: ${product?.name ?? "Producto"}` };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  await connection();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, id);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-sm text-muted hover:text-gray-900">
          ← Productos
        </Link>
        <span className="text-muted">/</span>
        <h1 className="text-xl font-bold text-gray-900">Editar: {product.name}</h1>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 max-w-2xl">
        <ProductForm
          action={boundAction}
          categories={categories}
          defaultValues={product}
          submitLabel="Guardar cambios"
        />
      </div>
    </div>
  );
}
