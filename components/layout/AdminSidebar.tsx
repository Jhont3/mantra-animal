import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { logoutAction } from "@/actions/auth";

export default function AdminSidebar() {
  return (
    <aside className="w-60 shrink-0 bg-gray-900 text-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <Link href="/admin">
          <Image src="/imgs/logo-white.svg" alt="Mantra Animal Admin" width={120} height={34} />
        </Link>
        <p className="text-xs text-gray-500 mt-1">Panel de administración</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
        <SidebarLink href="/admin">Dashboard</SidebarLink>
        <SidebarLink href="/admin/products">Productos</SidebarLink>
        <SidebarLink href="/admin/categories">Categorías</SidebarLink>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-800">
        <Link href="/" className="block text-xs text-gray-500 hover:text-white transition-colors mb-3">
          ← Ver sitio
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  children,
}: {
  href: Route;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
}
