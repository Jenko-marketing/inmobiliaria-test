import Link from "next/link";
import { Building2 } from "lucide-react";
import { SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-brand-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red text-white">
            <Building2 size={18} />
          </span>
          <span className="text-lg font-bold tracking-tight text-brand-gray-900">
            {SITE_NAME}
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-brand-gray-700 sm:flex">
          <Link href="/" className="hover:text-brand-red">
            Inicio
          </Link>
          <Link href="/propiedades?operation=VENTA" className="hover:text-brand-red">
            Venta
          </Link>
          <Link href="/propiedades?operation=ALQUILER" className="hover:text-brand-red">
            Alquiler
          </Link>
        </nav>
        <Link
          href="/login"
          className="rounded-lg border border-brand-gray-300 px-3 py-1.5 text-sm font-medium text-brand-gray-700 hover:border-brand-red hover:text-brand-red"
        >
          Acceso interno
        </Link>
      </div>
    </header>
  );
}
