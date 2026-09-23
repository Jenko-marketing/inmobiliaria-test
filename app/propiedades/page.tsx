import Link from "next/link";
import { clsx } from "clsx";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PropertyCard } from "@/components/PropertyCard";

const OPERATIONS = [
  { value: "", label: "Todas" },
  { value: "VENTA", label: "Venta" },
  { value: "ALQUILER", label: "Alquiler" },
];

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ operation?: string }>;
}) {
  const { operation } = await searchParams;

  const properties = await prisma.property.findMany({
    where: {
      status: { in: ["DISPONIBLE", "RESERVADA", "ALQUILADA", "VENDIDA"] },
      ...(operation ? { operation } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-bold text-brand-gray-900">Propiedades</h1>
          <div className="mt-4 flex gap-2">
            {OPERATIONS.map((op) => (
              <Link
                key={op.value}
                href={op.value ? `/propiedades?operation=${op.value}` : "/propiedades"}
                className={clsx(
                  "rounded-full px-4 py-1.5 text-sm font-medium",
                  (operation ?? "") === op.value
                    ? "bg-brand-red text-white"
                    : "bg-brand-gray-100 text-brand-gray-700 hover:bg-brand-gray-200",
                )}
              >
                {op.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
            {properties.length === 0 ? (
              <p className="col-span-full text-brand-gray-500">
                No hay propiedades para este filtro todavía.
              </p>
            ) : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
