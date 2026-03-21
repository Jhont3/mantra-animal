"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleFavoriteAction } from "@/actions/favorites";

interface Props {
  productId: string;
  isFavorite: boolean;
  userId?: string;
}

export default function FavoriteButton({ productId, isFavorite, userId }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      await toggleFavoriteAction(productId);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-sm transition-all disabled:opacity-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-4 h-4 transition-colors"
        fill={isFavorite ? "#ef4444" : "none"}
        stroke={isFavorite ? "#ef4444" : "#6b7280"}
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
