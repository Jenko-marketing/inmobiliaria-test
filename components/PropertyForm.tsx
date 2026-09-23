import {
  OPERATION_LABEL,
  PROPERTY_STATUS_LABEL,
  PROPERTY_TYPE_LABEL,
  parseImages,
} from "@/lib/format";
import type { Property } from "@prisma/client";

const inputClass =
  "mt-1 w-full rounded-lg border border-brand-gray-300 px-3 py-2 text-sm focus:border-brand-red focus:outline-none";
const labelClass = "text-sm font-medium text-brand-gray-700";

export function PropertyForm({
  action,
  property,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  property?: Property;
  submitLabel: string;
}) {
  const images = property ? parseImages(property.images).join(", ") : "";

  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Título</label>
          <input name="title" required defaultValue={property?.title} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Dirección</label>
          <input name="address" required defaultValue={property?.address} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Ciudad</label>
          <input name="city" required defaultValue={property?.city} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Tipo</label>
          <select name="type" defaultValue={property?.type ?? "CASA"} className={inputClass}>
            {Object.entries(PROPERTY_TYPE_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Operación</label>
          <select name="operation" defaultValue={property?.operation ?? "VENTA"} className={inputClass}>
            {Object.entries(OPERATION_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <select name="status" defaultValue={property?.status ?? "DISPONIBLE"} className={inputClass}>
            {Object.entries(PROPERTY_STATUS_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Precio</label>
          <input
            name="price"
            type="number"
            required
            defaultValue={property?.price}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Moneda</label>
          <input name="currency" defaultValue={property?.currency ?? "USD"} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Dormitorios</label>
          <input
            name="bedrooms"
            type="number"
            defaultValue={property?.bedrooms ?? undefined}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Baños</label>
          <input
            name="bathrooms"
            type="number"
            defaultValue={property?.bathrooms ?? undefined}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Superficie (m²)</label>
          <input
            name="areaM2"
            type="number"
            defaultValue={property?.areaM2 ?? undefined}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={property?.featured}
            className="h-4 w-4 rounded border-brand-gray-300 text-brand-red focus:ring-brand-red"
          />
          <label htmlFor="featured" className="text-sm text-brand-gray-700">
            Destacar en la home
          </label>
        </div>
      </div>

      <div>
        <label className={labelClass}>Descripción</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={property?.description}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Imágenes (URLs separadas por coma)</label>
        <input name="images" defaultValue={images} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>URL de panorama 360° (opcional)</label>
        <input
          name="panoramaUrl"
          defaultValue={property?.panoramaUrl ?? ""}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-brand-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-dark"
      >
        {submitLabel}
      </button>
    </form>
  );
}
