import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces, Cedarville_Cursive, Roboto_Serif } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/loader/PageLoader";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
});

const cedarville = Cedarville_Cursive({
  variable: "--font-cedar",
  subsets: ["latin"],
  weight: "400",
});

const robotoSerif = Roboto_Serif({
  variable: "--font-roboto-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
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
    <html lang="es" className={`${jakarta.variable} ${fraunces.variable} ${cedarville.variable} ${robotoSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
