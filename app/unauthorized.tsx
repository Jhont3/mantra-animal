import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">🔒</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso requerido</h1>
        <p className="text-muted mb-6">
          Debes iniciar sesión para acceder a esta sección.
        </p>
        <Link href="/login" className="btn-primary">
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}
