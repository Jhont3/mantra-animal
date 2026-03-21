import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppUrl, generalInquiryMessage } from "@/lib/whatsapp";

export default function Footer() {
  const waUrl = buildWhatsAppUrl(generalInquiryMessage());

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image
              src="/imgs/logo-white.svg"
              alt="Mantra Animal"
              width={280}
              height={80}
              className="h-10 w-auto mb-4"
            />
            <p className="text-sm text-gray-400 max-w-xs">
              Medicina veterinaria en casa. Atención domiciliaria para tu mascota en el Área
              Metropolitana de Medellín.
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Entrega de productos: 1–2 días hábiles dentro del Área Metropolitana.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Tienda</Link></li>
              <li><Link href="/#services" className="hover:text-white transition-colors">Servicios</Link></li>
              <li><Link href="/#about" className="hover:text-white transition-colors">Nosotros</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>📱</span> WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/mantranimal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>📸</span> @mantranimal
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-xs text-gray-500 text-center">
          © 2026 Mantra Animal. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
