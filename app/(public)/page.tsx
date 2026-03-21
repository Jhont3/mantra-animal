import type { Metadata } from "next";
import { connection } from "next/server";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildWhatsAppUrl, generalInquiryMessage, serviceInquiryMessage } from "@/lib/whatsapp";
import ProductCard from "@/components/products/ProductCard";
import WhatsAppCTA from "@/components/whatsapp/WhatsAppCTA";

export const metadata: Metadata = {
  title: "Mantra Animal — Medicina veterinaria en casa",
  description:
    "Veterinaria a domicilio en Medellín. Gastroenterología, consulta e imagenología para perros y gatos.",
};

const SERVICES = [
  {
    icon: "🩺",
    title: "Consulta e imagenología",
    description:
      "Consulta veterinaria completa y estudios de imagen en la comodidad de tu hogar. Sin estrés para ti ni para tu mascota.",
    query: "Consulta e imagenología a domicilio",
  },
  {
    icon: "🫀",
    title: "Gastroenterología",
    description:
      "Diagnóstico y tratamiento de problemas digestivos para perros y gatos por especialista en medicina interna.",
    query: "Gastroenterología veterinaria a domicilio",
  },
  {
    icon: "🤝",
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
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-surface via-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left slide-up">
              <span className="inline-block text-xs font-semibold text-primary-light uppercase tracking-widest mb-4">
                Medellín · Área Metropolitana
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Medicina veterinaria{" "}
                <span className="text-primary">en casa</span> 🤍
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Gastroenterología, consulta e imagenología a domicilio para perros y gatos.
                Sin estrés, sin filas. Tu mascota merece lo mejor.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/shop" className="btn-primary text-base py-3 px-7 text-center">
                  Ver tienda
                </Link>
                <WhatsAppCTA
                  message={generalInquiryMessage()}
                  label="Agendar cita"
                  size="lg"
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
                className="w-full max-w-sm lg:max-w-md drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────── */}
      <section id="services" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 slide-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Nuestros servicios
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Atención veterinaria especializada, directamente en tu domicilio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <article
                key={service.title}
                className={`bg-surface rounded-2xl p-7 border border-border hover:border-primary/30 hover:shadow-md transition-all slide-up stagger-${i + 1}`}
              >
                <span className="text-4xl block mb-4">{service.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
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

      {/* ── About ─────────────────────────────────────────────────── */}
      <section id="about" className="py-16 lg:py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center slide-up">
            <Image
              src="/imgs/logo-white.svg"
              alt="Mantra Animal"
              width={160}
              height={46}
              className="mx-auto mb-6"
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Nuestra misión
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-6">
              En Mantra Animal creemos que cada mascota merece atención veterinaria de la más
              alta calidad, sin que su familia tenga que enfrentar el estrés de un viaje a la
              clínica. Llevamos la medicina veterinaria especializada hasta la puerta de tu casa
              en el Área Metropolitana de Medellín.
            </p>
            <p className="text-blue-200 text-base">
              Perros, gatos y sus familias: eso es lo que nos importa.
            </p>
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Productos destacados
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                  Los mejores productos para el cuidado de tu mascota
                </p>
              </div>
              <Link href="/shop" className="btn-outline hidden sm:inline-flex">
                Ver todo →
              </Link>
            </div>

            {/* Mock payment banner */}
            <div className="mb-6 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800 text-center">
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
      <section className="py-14 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="text-4xl mb-4">📸</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Síguenos en Instagram</h2>
          <p className="text-gray-500 mb-6">
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
