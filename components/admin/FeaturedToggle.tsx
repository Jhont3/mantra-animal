"use client";

import { useTransition } from "react";
import { toggleFeaturedAction } from "@/actions/products";
import { toast } from "sonner";

export default function FeaturedToggle({
  productId,
  isFeatured,
}: {
  productId: string;
  isFeatured: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleFeaturedAction(productId);
      if (result.success) {
        toast.success(
          isFeatured
            ? "Producto removido de destacados"
            : "Producto marcado como destacado"
        );
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={isFeatured ? "Quitar de destacados" : "Marcar como destacado"}
      className="disabled:opacity-50"
    >
      {isFeatured ? (
        <span className="text-amber-500 text-lg">&#9733;</span>
      ) : (
        <span className="text-gray-300 text-lg hover:text-amber-400 transition-colors">
          &#9734;
        </span>
      )}
    </button>
  );
}
