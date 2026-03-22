import type { Metadata } from "next";
import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildWhatsAppUrl, generalInquiryMessage, serviceInquiryMessage } from "@/lib/whatsapp";
import ProductCard from "@/components/products/ProductCard";
import WhatsAppCTA from "@/components/whatsapp/WhatsAppCTA";
import CategoryScroller from "@/components/categories/CategoryScroller";

export const metadata: Metadata = {
  title: "Mantra Animal — Medicina veterinaria en casa",
  description:
    "Veterinaria a domicilio en Medellín. Gastroenterología, consulta e imagenología para perros y gatos.",
};

const SERVICES = [
  {
    svg: "/imgs/imagenology.svg",
    title: "Consulta e imagenología",
    description:
      "Consulta veterinaria completa y estudios de imagen en la comodidad de tu hogar. Sin estrés para ti ni para tu mascota.",
    query: "Consulta e imagenología a domicilio",
  },
  {
    svg: "/imgs/gastro-consult.svg",
    title: "Gastroenterología",
    description:
      "Diagnóstico y tratamiento de problemas digestivos para perros y gatos por especialista en medicina interna.",
    query: "Gastroenterología veterinaria a domicilio",
  },
  {
    svg: "/imgs/domiciliary-consult.svg",
    title: "Interconsulta",
    description:
      "Coordinamos con tu veterinario de cabecera para ofrecerte una segunda opinión especializada sin salir de casa.",
    query: "Interconsulta veterinaria",
  },
];

export default async function LandingPage() {
  await connection();
  const featuredProducts = await prisma.product.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const waGeneral = buildWhatsAppUrl(generalInquiryMessage());

  return (
    <>
      {/* ── Above-the-fold: Hero + scroll hint + Trust bar (100dvh) ── */}
      <div className="min-h-[calc(100dvh-4rem)] flex flex-col">

        {/* Hero */}
        <section className="flex-1 relative bg-surface overflow-hidden flex items-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_-10%,rgba(116,170,174,0.18),transparent)]" />
          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-10">
              {/* Text */}
              <div className="flex-1 text-center lg:text-left slide-up">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest mb-5 bg-primary/8 rounded-full px-3 py-1">
                  📍 Medellín · Área Metropolitana
                </span>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Medicina veterinaria{" "}
                  <span className="text-primary italic">en casa</span> 🤍
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Gastroenterología, consulta e imagenología a domicilio para perros y gatos.
                  Sin estrés, sin filas. Tu mascota merece lo mejor.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link href="/shop" className="btn-primary text-base py-3 px-7">
                    Ver tienda
                  </Link>
                  <WhatsAppCTA
                    message={generalInquiryMessage()}
                    label="Agendar cita"
                    size="lg"
                    variant="accent"
                  />
                </div>
              </div>

              {/* Illustration */}
              <div className="flex-1 flex justify-center lg:justify-end slide-up stagger-2">
                <Image
                  src="/imgs/00 Grafico Veterinaria.webp"
                  alt="Veterinaria a domicilio Mantra Animal"
                  width={500}
                  height={500}
                  priority
                  className="w-full max-w-xs sm:max-w-sm lg:max-w-md drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Scroll indicator */}
        <div className="flex justify-center py-3 bg-surface">
          <div className="flex flex-col items-center gap-1 animate-bounce text-muted">
            <span className="text-xs font-medium tracking-wide uppercase">Descubre más</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Trust bar */}
        <section className="border-t border-border bg-white py-4">
          <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-5 sm:gap-10 text-sm text-foreground font-medium">
            {[
              { icon: "🏠", label: "Atención domiciliaria" },
              { icon: "🐾", label: "Perros y gatos" },
              { icon: "🎓", label: "Especialistas certificados" },
              { icon: "⚡", label: "Cita en 24 h" },
            ].map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-2">
                <span>{icon}</span>{label}
              </span>
            ))}
          </div>
        </section>

      </div>

      {/* ── Services ─────────────────────────────────────────────── */}
      <section id="services" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 slide-up">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Nuestros servicios
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Atención veterinaria especializada, directamente en tu domicilio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <article
                key={service.title}
                className={`bg-surface rounded-2xl p-7 border border-border hover:border-primary/40 hover:shadow-md transition-all slide-up stagger-${i + 1}`}
              >
                <div className="w-16 h-16 mb-5">
                  <Image
                    src={service.svg}
                    alt={service.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">{service.description}</p>
                <WhatsAppCTA
                  message={serviceInquiryMessage(service.query)}
                  label="Solicitar servicio"
                  size="sm"
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────── */}
      <section className="py-12 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 slide-up">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Compra por categoría
            </h2>
            <p className="text-muted text-sm">Todo lo que tu mascota necesita</p>
          </div>
          <CategoryScroller />
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">
                  Productos destacados
                </h2>
                <p className="text-muted mt-1 text-sm">
                  Los mejores productos para el cuidado de tu mascota
                </p>
              </div>
              <Link href="/shop" className="btn-outline hidden sm:inline-flex">
                Ver todo →
              </Link>
            </div>

            {/* Mock payment banner */}
            <div className="mb-6 p-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-gray-700 text-center">
              💳 Pagos en línea próximamente. Por ahora, escríbenos por WhatsApp.
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {featuredProducts.map((p: typeof featuredProducts[0]) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link href="/shop" className="btn-outline">
                Ver todos los productos →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Instagram CTA ─────────────────────────────────────────── */}
      <section className="py-14 bg-surface border-t border-border">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-4xl mb-4">📸</p>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Síguenos en Instagram</h2>
          <p className="text-muted mb-6">
            Consejos veterinarios, casos clínicos y mucho amor por las mascotas.
          </p>
          <a
            href="https://www.instagram.com/mantranimal/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-opacity"
          >
            @mantranimal
          </a>
        </div>
      </section>
    </>
  );
}
