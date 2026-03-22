"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppUrl, productInquiryMessage } from "@/lib/whatsapp";
import FavoriteButton from "./FavoriteButton";
import type { ProductCard as ProductCardType } from "@/types";

interface Props {
  product: ProductCardType;
  isFavorite?: boolean;
  userId?: string;
}

const SPECIES_LABELS: Record<string, string> = {
  dog: "Perro",
  cat: "Gato",
};

export default function ProductCard({ product, isFavorite = false, userId }: Props) {
  const [imgSrc, setImgSrc] = useState(product.imageUrl);
  const waUrl = buildWhatsAppUrl(productInquiryMessage(product.name));

  return (
    <article className="group bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="block relative aspect-square overflow-hidden bg-surface">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgSrc("/imgs/placeholder.jpg")}
        />
        {/* Species badges */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {product.species.map((s: string) => (
            <span
              key={s}
              className="text-xs bg-white/90 text-gray-700 rounded-full px-2 py-0.5 font-medium border border-border"
            >
              {SPECIES_LABELS[s] ?? s}
            </span>
          ))}
        </div>
        {/* Favorite */}
        <div className="absolute top-2 right-2">
          <FavoriteButton productId={product.id} isFavorite={isFavorite} userId={userId} />
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-muted uppercase tracking-wide mb-0.5">{product.brand}</p>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-primary transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="text-base font-bold text-gray-900">
            ${product.price.toLocaleString("es-CO")}
          </span>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-1.5 font-medium transition-colors shrink-0"
          >
            Comprar
          </a>
        </div>
      </div>
    </article>
  );
}
