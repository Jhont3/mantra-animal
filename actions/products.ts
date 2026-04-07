"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";
import { getCurrentUser } from "@/actions/auth";
import type { ActionResult } from "@/types";
import { Species } from "@prisma/client";

const productSchema = z.object({
  name:         z.string().min(2, "Nombre requerido"),
  brand:        z.string().min(1, "Marca requerida"),
  description:  z.string().min(10, "Descripción muy corta"),
  price:        z.coerce.number().positive("Precio inválido"),
  categoryId:   z.string().min(1, "Categoría requerida"),
  presentation: z.string().min(1, "Presentación requerida"),
  active:       z.coerce.boolean().default(true),
  species:      z.array(z.nativeEnum(Species)).min(1, "Selecciona al menos una especie"),
});

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) throw new Error("Forbidden");
  return user;
}

export async function createProductAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const species = formData.getAll("species") as Species[];
  const parsed = productSchema.safeParse({
    name:         formData.get("name"),
    brand:        formData.get("brand"),
    description:  formData.get("description"),
    price:        formData.get("price"),
    categoryId:   formData.get("categoryId"),
    presentation: formData.get("presentation"),
    active:       formData.get("active") === "on",
    species,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const imageFile = formData.get("image") as File | null;
  const imageUrlInput = (formData.get("imageUrl") as string | null)?.trim() ?? "";
  let imageUrl = "/imgs/placeholder.jpg";

  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    imageUrl = await uploadImage(buffer);
  } else if (imageUrlInput) {
    imageUrl = imageUrlInput;
  }

  const slug = slugify(parsed.data.name);

  const product = await prisma.product.create({
    data: { ...parsed.data, slug, imageUrl },
  });

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  redirect(`/admin/products/${product.id}/edit`);
}

export async function updateProductAction(
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  await requireAdmin();

  const species = formData.getAll("species") as Species[];
  const parsed = productSchema.safeParse({
    name:         formData.get("name"),
    brand:        formData.get("brand"),
    description:  formData.get("description"),
    price:        formData.get("price"),
    categoryId:   formData.get("categoryId"),
    presentation: formData.get("presentation"),
    active:       formData.get("active") === "on",
    species,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const imageFile = formData.get("image") as File | null;
  const imageUrlInput = (formData.get("imageUrl") as string | null)?.trim() ?? "";
  let imageUrl: string | undefined;

  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    imageUrl = await uploadImage(buffer);
  } else if (imageUrlInput) {
    imageUrl = imageUrlInput;
  }

  await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      ...(imageUrl && { imageUrl }),
    },
  });

  const updated = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
  revalidatePath("/shop");
  if (updated) revalidatePath(`/shop/${updated.slug}`);
  revalidatePath("/admin/products");
  return { success: true, data: undefined };
}

/** Plain form action for delete (used in admin table without useActionState) */
export async function deleteProductFormAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/shop");
  revalidatePath("/admin/products");
}

export async function toggleFeaturedAction(productId: string): Promise<ActionResult> {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { featuredOrder: true },
  });

  if (!product) return { success: false, error: "Producto no encontrado" };

  if (product.featuredOrder !== null) {
    await prisma.product.update({
      where: { id: productId },
      data: { featuredOrder: null },
    });
  } else {
    const maxOrder = await prisma.product.aggregate({
      _max: { featuredOrder: true },
    });
    const nextOrder = (maxOrder._max.featuredOrder ?? 0) + 1;
    await prisma.product.update({
      where: { id: productId },
      data: { featuredOrder: nextOrder },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin/featured");
  return { success: true, data: undefined };
}

export async function updateFeaturedOrderAction(
  orderedIds: string[]
): Promise<ActionResult> {
  await requireAdmin();

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.product.update({
        where: { id },
        data: { featuredOrder: index + 1 },
      })
    )
  );

  revalidatePath("/");
  revalidatePath("/admin/featured");
  return { success: true, data: undefined };
}

export async function removeFeaturedAction(productId: string): Promise<ActionResult> {
  await requireAdmin();

  await prisma.product.update({
    where: { id: productId },
    data: { featuredOrder: null },
  });

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin/featured");
  return { success: true, data: undefined };
}
