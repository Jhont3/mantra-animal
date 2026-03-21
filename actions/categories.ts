"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/auth";
import type { ActionResult } from "@/types";

const categorySchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  name: z.string().min(2, "Nombre requerido"),
});

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) throw new Error("Forbidden");
}

/** Used with useActionState in forms */
export async function createCategoryAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await prisma.category.create({ data: parsed.data });
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  return { success: true, data: undefined };
}

/** Plain form action (no useActionState) */
export async function createCategoryFormAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = categorySchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
  });
  if (!parsed.success) return;
  await prisma.category.create({ data: parsed.data });
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function updateCategoryAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = categorySchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  await prisma.category.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  return { success: true, data: undefined };
}

/** Plain form action for delete */
export async function deleteCategoryFormAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  return { success: true, data: undefined };
}
