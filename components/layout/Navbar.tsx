import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { getCurrentUser } from "@/actions/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center">
          <Image
            src="/imgs/logo-dark-green.svg"
            alt="Mantra Animal"
            width={280}
            height={80}
            priority
            className="h-14 sm:h-16 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {([
            { href: "/", label: "Inicio" },
            { href: "/shop", label: "Tienda" },
            { href: "/#services", label: "Servicios" },
          ] as { href: Route; label: string }[]).map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-lg text-foreground hover:text-primary hover:bg-primary/6 transition-all duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/8 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Admin
                </Link>
              )}
              <NavbarClient user={user} />
            </>
          ) : (
            <Link href="/login" className="btn-primary text-sm py-1.5 px-4">
              Iniciar sesión
            </Link>
          )}

          {/* Mobile menu button */}
          <NavbarClient user={user} mobileMenuOnly />
        </div>

      </div>
    </header>
  );
}
