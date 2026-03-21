import type { Category, Favorite, Product, Species } from "@prisma/client";

export type { Species };

export type ProductWithCategory = Product & {
  category: Category;
};

export type ProductWithDetails = Product & {
  category: Category;
  favorites: Favorite[];
};

export type CategoryWithCount = Category & {
  _count: { products: number };
};

/** Shape returned by product list queries */
export type ProductCard = Pick<
  Product,
  "id" | "slug" | "name" | "brand" | "price" | "imageUrl" | "species" | "active"
> & {
  category: Pick<Category, "id" | "slug" | "name">;
};

/** Admin profile from Supabase user metadata or profiles table */
export interface UserProfile {
  id: string;
  email: string;
  isAdmin: boolean;
}

/** Server Action result envelope */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
