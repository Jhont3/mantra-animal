import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import type { ProductCard as ProductCardType } from "@/types";

interface Props {
  products: ProductCardType[];
  favoriteIds?: string[];
  userId?: string;
  loading?: boolean;
}

export default function ProductGrid({ products, favoriteIds = [], userId, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-20 text-muted">
        <p className="text-4xl mb-3">🐾</p>
        <p className="font-medium">No encontramos productos con ese filtro.</p>
        <p className="text-sm mt-1">Prueba con otra categoría o búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          isFavorite={favoriteIds.includes(p.id)}
          userId={userId}
        />
      ))}
    </div>
  );
}
