import { Building2 } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { SITE_NAME } from "@/lib/site";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-brand-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red text-white">
            <Building2 size={18} />
          </span>
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
