import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/loader/PageLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Mantra Animal",
    default: "Mantra Animal — Medicina veterinaria en casa",
  },
  description:
    "Veterinaria a domicilio en Medellín. Gastroenterología, consulta, imagenología e interconsulta para tu mascota. Entrega de productos en 1–2 días.",
  openGraph: {
    siteName: "Mantra Animal",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
