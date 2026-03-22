"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import type { UserProfile } from "@/types";

interface Props {
  user: UserProfile | null;
  mobileMenuOnly?: boolean;
}

function UserAvatar({ email }: { email: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-primary-light/20 border border-primary-light text-primary text-sm font-semibold flex items-center justify-center shrink-0">
      {email[0].toUpperCase()}
    </div>
  );
}

export default function NavbarClient({ user, mobileMenuOnly = false }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (mobileMenuOnly) {
    return (
      <>
        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-foreground hover:bg-surface transition-colors"
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
            <nav className="flex flex-col px-4 py-3 gap-1 text-sm font-medium">
              <Link href="/" onClick={() => setMenuOpen(false)} className="py-2 text-foreground hover:text-primary transition-colors">Inicio</Link>
              <Link href="/shop" onClick={() => setMenuOpen(false)} className="py-2 text-foreground hover:text-primary transition-colors">Tienda</Link>
              <Link href="/#services" onClick={() => setMenuOpen(false)} className="py-2 text-foreground hover:text-primary transition-colors">Servicios</Link>
              <Link href="/#about" onClick={() => setMenuOpen(false)} className="py-2 text-foreground hover:text-primary transition-colors">Nosotros</Link>
              {user?.isAdmin && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="py-2 text-primary font-semibold">Admin</Link>
              )}
              {user ? (
                <div className="pt-2 border-t border-border mt-1 flex items-center justify-between">
                  <span className="text-xs text-muted truncate max-w-[160px]">{user.email}</span>
                  <form action={logoutAction}>
                    <button type="submit" className="text-danger text-sm font-medium">Salir</button>
                  </form>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="py-2 text-primary font-semibold">Iniciar sesión</Link>
              )}
            </nav>
          </div>
        )}
      </>
    );
  }

  // Desktop — user is logged in
  return (
    <div className="hidden md:flex items-center gap-2">
      <UserAvatar email={user!.email} />
      <form action={logoutAction}>
        <button type="submit" className="text-sm text-muted hover:text-danger transition-colors">
          Salir
        </button>
      </form>
    </div>
  );
}
