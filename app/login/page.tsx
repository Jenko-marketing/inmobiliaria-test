import Image from "next/image";
import { LoginForm } from "./LoginForm";
import { SITE_NAME } from "@/lib/site";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-brand-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt={SITE_NAME} width={40} height={40} className="h-10 w-10" />
          <span className="text-lg font-bold text-brand-gray-900">{SITE_NAME}</span>
        </div>
        <h1 className="mt-6 text-xl font-bold text-brand-gray-900">Panel interno</h1>
        <p className="mt-1 text-sm text-brand-gray-500">
          Acceso para el equipo de la inmobiliaria.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
