"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">⚠️</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Algo salió mal</h1>
        <p className="text-muted mb-6">
          Ocurrió un error inesperado. Por favor intenta de nuevo.
        </p>
        <button onClick={reset} className="btn-primary">
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
