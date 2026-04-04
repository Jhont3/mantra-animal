"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { createCategoryAction, deleteCategoryAction } from "@/actions/categories";
import { toast } from "sonner";
import type { ActionResult } from "@/types";

export function CreateCategoryForm() {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    createCategoryAction as any, 
    null
  );
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Categoría creada exitosamente");
      formRef.current?.reset();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-primary mb-1">
          Nombre (visible al usuario)
        </label>
        <input
          name="name"
          required
          className="w-full border border-border bg-white text-foreground rounded-lg px-3 py-2.5 text-sm shadow-sm transition-all duration-200 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary-medium"
          placeholder="Concentrados / Comida"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-primary mb-1">
          Slug (URL)
        </label>
        <input
          name="slug"
          required
          pattern="[a-z0-9-]+"
          className="w-full border border-border bg-white text-foreground rounded-lg px-3 py-2.5 text-sm shadow-sm transition-all duration-200 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary-medium"
          placeholder="food"
        />
      </div>
      <button 
        type="submit" 
        disabled={isPending} 
        className="w-full rounded-lg px-4 py-2.5 font-medium text-white shadow-sm bg-primary hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Creando..." : "Crear categoría"}
      </button>
    </form>
  );
}

export function DeleteCategoryForm({ id, productCount }: { id: string, productCount: number }) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (formData: FormData) => {
    if (productCount > 0) {
      toast.error("No se puede eliminar la categoría porque tiene productos asignados");
      return;
    }
    
    startTransition(async () => {
      try {
        const res = await deleteCategoryAction(formData.get("id") as string);
        if (res?.success) {
          toast.success("Categoría eliminada con éxito");
        } else {
          toast.error(res?.error || "Error al eliminar la categoría");
        }
      } catch (err) {
        toast.error("Ocurrió un error inesperado al eliminar");
      }
    });
  };

  return (
    <form action={handleAction}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={productCount > 0 || isPending}
        className="text-danger hover:text-red-700 font-medium hover:underline text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        title={productCount > 0 ? "Elimina los productos primero" : "Eliminar categoría"}
      >
        {isPending ? "Eliminando..." : "Eliminar"}
      </button>
    </form>
  );
}
