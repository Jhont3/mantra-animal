"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/auth";
import type { ActionResult } from "@/types";

export async function toggleFavoriteAction(
  productId: string
): Promise<ActionResult<{ isFavorite: boolean }>> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Debes iniciar sesión" };

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    revalidatePath("/shop");
    return { success: true, data: { isFavorite: false } };
  }

  await prisma.favorite.create({
    data: { userId: user.id, productId },
  });
  revalidatePath("/shop");
  return { success: true, data: { isFavorite: true } };
}

export async function getUserFavoriteIds(userId: string): Promise<string[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { productId: true },
  });
  return favorites.map((f: { productId: string }) => f.productId);
}
