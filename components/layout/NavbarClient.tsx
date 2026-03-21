"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import type { UserProfile } from "@/types";

interface Props {
  user: UserProfile | null;
  mobileMenuOnly?: boolean;
}

export default function NavbarClient({ user, mobileMenuOnly = false }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (mobileMenuOnly) {
    return (
      <>
        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-border shadow-lg md:hidden z-50">
            <nav className="flex flex-col px-4 py-3 gap-3 text-sm font-medium text-gray-700">
              <Link href="/" onClick={() => setMenuOpen(false)} className="py-2 hover:text-primary">Inicio</Link>
              <Link href="/shop" onClick={() => setMenuOpen(false)} className="py-2 hover:text-primary">Tienda</Link>
              <Link href="/#services" onClick={() => setMenuOpen(false)} className="py-2 hover:text-primary">Servicios</Link>
              <Link href="/#about" onClick={() => setMenuOpen(false)} className="py-2 hover:text-primary">Nosotros</Link>
              {user?.isAdmin && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="py-2 text-primary font-semibold">Admin</Link>
              )}
              {user ? (
                <form action={logoutAction}>
                  <button type="submit" className="py-2 text-danger w-full text-left">Cerrar sesión</button>
                </form>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="py-2 text-primary font-semibold">Iniciar sesión</Link>
              )}
            </nav>
          </div>
        )}
      </>
    );
  }

  // Desktop logout button
  return (
    <form action={logoutAction}>
      <button type="submit" className="text-sm text-gray-600 hover:text-danger transition-colors hidden md:block">
        Salir
      </button>
    </form>
  );
}
