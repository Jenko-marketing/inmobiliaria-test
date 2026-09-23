import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PropertyForm } from "@/components/PropertyForm";
import { updateProperty, deleteProperty } from "@/lib/actions/properties";

export default async function EditarPropiedadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) notFound();

  const boundUpdate = updateProperty.bind(null, property.id);
  const boundDelete = deleteProperty.bind(null, property.id);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-gray-900">Editar propiedad</h1>
          <p className="mt-1 text-sm text-brand-gray-500">{property.title}</p>
        </div>
        <form action={boundDelete}>
          <button
            type="submit"
            className="rounded-lg border border-brand-red px-4 py-2 text-sm font-semibold text-brand-red hover:bg-brand-red-light"
          >
            Eliminar
          </button>
        </form>
      </div>
      <div className="mt-6 rounded-xl border border-brand-gray-200 bg-white p-6 shadow-sm">
        <PropertyForm action={boundUpdate} property={property} submitLabel="Guardar cambios" />
      </div>
    </div>
  );
}
