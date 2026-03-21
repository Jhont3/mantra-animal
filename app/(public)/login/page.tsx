import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/imgs/logo-dark-green.svg"
            alt="Mantra Animal"
            width={150}
            height={43}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h1>
          <p className="text-muted text-sm mt-1">Inicia sesión para acceder a tus favoritos</p>
        </div>
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
