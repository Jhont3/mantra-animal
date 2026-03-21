import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">🐾</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
        <p className="text-muted mb-6">
          Parece que esta página se fue a dar una vuelta. Volvamos al inicio.
        </p>
        <Link href="/" className="btn-primary">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
