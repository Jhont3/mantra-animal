import type { Metadata } from "next";
import { connection } from "next/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/auth";
import { buildWhatsAppUrl, productInquiryMessage } from "@/lib/whatsapp";
import WhatsAppCTA from "@/components/whatsapp/WhatsAppCTA";
import FavoriteButton from "@/components/products/FavoriteButton";
import { getUserFavoriteIds } from "@/actions/favorites";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true, imageUrl: true },
  });
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: { images: [product.imageUrl] },
  };
}

const SPECIES_LABELS: Record<string, string> = { dog: "Perro", cat: "Gato" };

export default async function ProductDetailPage({ params }: Props) {
  await connection();
  const { slug } = await params;

  const [product, user] = await Promise.all([
    prisma.product.findUnique({
      where: { slug, active: true },
      include: { category: true },
    }),
    getCurrentUser(),
  ]);

  if (!product) notFound();

  const favoriteIds = user ? await getUserFavoriteIds(user.id) : [];
  const isFavorite = favoriteIds.includes(product.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface border border-border">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {/* Breadcrumb */}
          <p className="text-xs text-muted mb-2">
            <a href="/shop" className="hover:underline">Tienda</a>
            {" / "}
            {product.category.name}
          </p>

          {/* Species badges */}
          <div className="flex gap-2 mb-3">
            {product.species.map((s: string) => (
              <span
                key={s}
                className="text-xs bg-surface text-gray-700 rounded-full px-3 py-1 border border-border font-medium"
              >
                {SPECIES_LABELS[s] ?? s}
              </span>
            ))}
          </div>

          <p className="text-sm font-semibold text-muted uppercase tracking-wide mb-1">
            {product.brand}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          <p className="text-3xl font-bold text-primary mb-4">
            ${product.price.toLocaleString("es-CO")}
          </p>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>

          {/* Presentation */}
          {product.presentation && (
            <p className="text-sm text-muted mb-6">
              <span className="font-medium text-gray-700">Presentación:</span>{" "}
              {product.presentation}
            </p>
          )}

          {/* Delivery note */}
          <p className="text-xs text-muted bg-surface border border-border rounded-lg p-3 mb-6">
            📦 Entrega en 1–2 días hábiles dentro del Área Metropolitana de Medellín.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <WhatsAppCTA
              message={productInquiryMessage(product.name)}
              label="Comprar por WhatsApp"
              size="lg"
              className="flex-1 justify-center"
            />
            <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg">
              <FavoriteButton
                productId={product.id}
                isFavorite={isFavorite}
                userId={user?.id}
              />
              <span className="text-sm text-muted">
                {isFavorite ? "En favoritos" : "Agregar a favoritos"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
