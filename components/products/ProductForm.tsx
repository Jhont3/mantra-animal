"use client";

import { useActionState } from "react";
import type { ActionResult, CategoryWithCount } from "@/types";
import type { Product } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionFn = (prev: any, formData: FormData) => Promise<ActionResult>;

interface Props {
  action: ActionFn;
  categories: CategoryWithCount[];
  defaultValues?: Partial<Product>;
  submitLabel?: string;
}

const initial: ActionResult = { success: true, data: undefined };

export default function ProductForm({
  action,
  categories,
  defaultValues,
  submitLabel = "Guardar",
}: Props) {
  const [state, formAction, isPending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-5">
      {!state.success && (
        <p className="text-sm text-danger bg-red-50 border border-red-200 rounded-lg p-3">
          {state.error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nombre" name="name" defaultValue={defaultValues?.name} required />
        <Field label="Marca" name="brand" defaultValue={defaultValues?.brand} required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          name="description"
          rows={4}
          required
          defaultValue={defaultValues?.description}
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Precio (COP)"
          name="price"
          type="number"
          step="1000"
          defaultValue={defaultValues?.price?.toString()}
          required
        />
        <Field label="Presentación" name="presentation" defaultValue={defaultValues?.presentation} required />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <select
          name="categoryId"
          defaultValue={defaultValues?.categoryId ?? ""}
          required
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Species */}
      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">Especie</p>
        <div className="flex gap-4">
          {[
            { value: "dog", label: "🐶 Perro" },
            { value: "cat", label: "🐱 Gato" },
          ].map((s) => (
            <label key={s.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="species"
                value={s.value}
                defaultChecked={(defaultValues as any)?.species?.includes(s.value)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Image */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Imagen del producto
        </label>
        <input
          type="url"
          name="imageUrl"
          defaultValue={defaultValues?.imageUrl ?? ""}
          placeholder="https://res.cloudinary.com/…"
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <p className="text-xs text-muted">O sube un archivo (reemplaza la URL):</p>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-white file:text-sm file:cursor-pointer"
        />
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="active"
          name="active"
          defaultChecked={defaultValues?.active ?? true}
          className="w-4 h-4 accent-primary"
        />
        <label htmlFor="active" className="text-sm font-medium text-gray-700">
          Producto activo (visible en la tienda)
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Guardando…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  step?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        step={step}
        className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
