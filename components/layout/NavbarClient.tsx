"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";
import { HiOutlineBars3, HiOutlineXMark, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import type { Route } from "next";
import type { UserProfile } from "@/types";

interface Props {
  user: UserProfile | null;
  mobileMenuOnly?: boolean;
}

function UserAvatar({ email }: { email: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-bold flex items-center justify-center shrink-0">
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
          className="md:hidden p-2 rounded-lg text-foreground hover:bg-surface transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          {menuOpen
            ? <HiOutlineXMark className="w-5 h-5" />
            : <HiOutlineBars3 className="w-5 h-5" />}
        </button>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-border shadow-lg md:hidden z-50">
            <nav className="flex flex-col px-4 py-4 gap-1 text-sm font-medium">
              {([
                { href: "/",          label: "Inicio"    },
                { href: "/shop",      label: "Tienda"    },
                { href: "/#services", label: "Servicios" },
              ] as { href: Route; label: string }[]).map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg text-foreground hover:text-primary hover:bg-primary/6 transition-colors"
                >
                  {label}
                </Link>
              ))}

              {user?.isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="py-2.5 px-3 rounded-lg text-primary font-semibold hover:bg-primary/6 transition-colors"
                >
                  Admin
                </Link>
              )}

              <div className="mt-2 pt-3 border-t border-border">
                {user ? (
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <UserAvatar email={user.email} />
                      <span className="text-xs text-muted truncate max-w-[150px]">{user.email}</span>
                    </div>
                    <form action={logoutAction}>
                      <button type="submit" className="flex items-center gap-1 text-danger text-sm font-medium hover:opacity-80 transition-opacity">
                        <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                        Salir
                      </button>
                    </form>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block btn-primary text-center w-full"
                  >
                    Iniciar sesión
                  </Link>
                )}
              </div>
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
        <button
          type="submit"
          className="flex items-center gap-1 text-sm text-muted hover:text-danger transition-colors"
          title="Cerrar sesión"
        >
          <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
          Salir
        </button>
      </form>
    </div>
  );
}
