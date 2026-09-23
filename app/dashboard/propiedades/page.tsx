import Link from "next/link";
import Image from "next/image";
import { Plus, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { PropertyStatusSelect } from "@/components/PropertyStatusSelect";
import {
  formatCurrency,
  OPERATION_LABEL,
  PROPERTY_TYPE_LABEL,
} from "@/lib/format";

export default async function DashboardPropiedadesPage() {
  const properties = await prisma.property.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-gray-900">Propiedades en stock</h1>
          <p className="mt-1 text-sm text-brand-gray-500">
            Lo que cargues acá se refleja al instante en el sitio público.
          </p>
        </div>
        <Link
          href="/dashboard/propiedades/nueva"
          className="flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark"
        >
          <Plus size={16} /> Nueva propiedad
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-brand-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-gray-50 text-xs uppercase text-brand-gray-500">
            <tr>
              <th className="px-4 py-3">Propiedad</th>
              <th className="px-4 py-3">Operación</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray-100">
            {properties.map((p) => (
              <tr key={p.id}>
                <td className="flex items-center gap-3 px-4 py-3">
                  <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-brand-gray-100">
                    {p.coverImage ? (
                      <Image src={p.coverImage} alt="" fill sizes="56px" className="object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <Link
                      href={`/dashboard/propiedades/${p.id}`}
                      className="font-medium text-brand-gray-900 visited:text-brand-gray-900 hover:text-brand-red"
                    >
                      {p.title}
                    </Link>
                    <p className="text-xs text-brand-gray-500">{p.address}</p>
                  </div>
                </td>
                <td className="px-4 py-3">{OPERATION_LABEL[p.operation]}</td>
                <td className="px-4 py-3">{PROPERTY_TYPE_LABEL[p.type]}</td>
                <td className="px-4 py-3 font-medium">{formatCurrency(p.price, p.currency)}</td>
                <td className="px-4 py-3">
                  <PropertyStatusSelect id={p.id} status={p.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/propiedades/${p.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs text-brand-gray-500 hover:text-brand-red"
                  >
                    Ver en sitio <ExternalLink size={12} />
                  </Link>
                </td>
              </tr>
            ))}
            {properties.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-gray-500">
                  Todavía no hay propiedades cargadas.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
