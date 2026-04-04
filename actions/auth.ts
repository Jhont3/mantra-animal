"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Nombre requerido"),
});

import { cookies } from "next/headers";

export async function loginAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  // --- OFFLINE / MOCK LOGIN ---
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("⚠️ Offline Mode: Mocking login action.");
    if (parsed.data.email === "admin@mantra.com" && parsed.data.password === "admin123") {
      const cookieStore = await cookies();
      cookieStore.set("mock_session", "admin");
      redirect("/admin/categories");
    } else {
      return { success: false, error: "Offline mode: Only admin@mantra.com / admin123 works." };
    }
  }
  // ----------------------------

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { success: false, error: "Email o contraseña incorrectos" };
  }

  redirect("/");
}

export async function registerAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { success: false, error: "Registro deshabilitado en modo offline. Ingresa con admin directamente." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.name } },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  redirect("/login?registered=1");
}

export async function logoutAction(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const cookieStore = await cookies();
    cookieStore.delete("mock_session");
    redirect("/");
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

/** Returns the current user or null */
export async function getCurrentUser() {
  // If running locally without .env keys, use mock session cookies
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const cookieStore = await cookies();
    if (cookieStore.get("mock_session")?.value === "admin") {
      return { id: "mock-admin", email: "admin@mantra.com", isAdmin: true };
    }
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? "",
    isAdmin: user.user_metadata?.role === "admin",
  };
}
