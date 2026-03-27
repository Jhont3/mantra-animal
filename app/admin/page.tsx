import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";
import DeployStatus from "@/components/admin/DeployStatus";

export const metadata: Metadata = { title: "Admin — Dashboard" };

export default async function AdminDashboard() {
  await connection();
  const [productCount, categoryCount, activeCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { active: true } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <DeployStatus />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/products"
          className="bg-white rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <p className="text-3xl font-bold text-primary mb-1">{productCount}</p>
          <p className="text-sm text-muted">Total productos</p>
        </Link>
        <Link
          href="/admin/products"
          className="bg-white rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <p className="text-3xl font-bold text-primary mb-1">{activeCount}</p>
          <p className="text-sm text-muted">Productos activos</p>
        </Link>
        <Link
          href="/admin/categories"
          className="bg-white rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-sm transition-all"
        >
          <p className="text-3xl font-bold text-primary mb-1">{categoryCount}</p>
          <p className="text-sm text-muted">Categorías</p>
        </Link>
      </div>

      <div className="flex gap-3">
        <Link href="/admin/products/new" className="btn-primary">
          + Nuevo producto
        </Link>
        <Link href="/admin/categories" className="btn-secondary">
          Gestionar categorías
        </Link>
      </div>
    </div>
  );
}
