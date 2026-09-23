import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-brand-gray-200 bg-brand-gray-950 text-brand-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-sm font-semibold text-white">{SITE_NAME}</p>
        <p className="mt-2 max-w-md text-sm text-brand-gray-500">
          Venta y alquiler de propiedades, con seguimiento personalizado de cada cliente
          y cada inquilino.
        </p>
        <p className="mt-6 text-xs text-brand-gray-500">
          © {new Date().getFullYear()} {SITE_NAME}. Sitio de demostración.
        </p>
      </div>
    </footer>
  );
}
