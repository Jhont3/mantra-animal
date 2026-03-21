import type { Metadata } from "next";
import Image from "next/image";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Crea tu cuenta</h1>
          <p className="text-muted text-sm mt-1">
            Guarda tus productos favoritos y gestiona tus pedidos
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
