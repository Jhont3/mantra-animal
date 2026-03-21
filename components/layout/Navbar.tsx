import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/actions/auth";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/imgs/logo-dark-green.svg"
            alt="Mantra Animal"
            width={140}
            height={40}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link href="/shop" className="hover:text-primary transition-colors">
            Tienda
          </Link>
          <Link href="/#services" className="hover:text-primary transition-colors">
            Servicios
          </Link>
          <Link href="/#about" className="hover:text-primary transition-colors">
            Nosotros
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.isAdmin && (
                <Link href="/admin" className="text-sm text-primary hover:underline hidden sm:block">
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
