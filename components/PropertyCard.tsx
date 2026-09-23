import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import type { Property } from "@prisma/client";
import { Badge, propertyStatusTone } from "@/components/Badge";
import {
  formatCurrency,
  OPERATION_LABEL,
  PROPERTY_STATUS_LABEL,
} from "@/lib/format";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/propiedades/${property.slug}`}
      className="group block overflow-hidden rounded-xl border border-brand-gray-200 bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="relative h-52 w-full overflow-hidden bg-brand-gray-100">
        {property.coverImage ? (
          <Image
            src={property.coverImage}
            alt={property.title}
            fill
            sizes="(min-width: 1024px) 380px, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone="gray" className="bg-white/90">
            {OPERATION_LABEL[property.operation] ?? property.operation}
          </Badge>
          <Badge tone={propertyStatusTone(property.status)} className="bg-white/90">
            {PROPERTY_STATUS_LABEL[property.status] ?? property.status}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <p className="text-lg font-bold text-brand-gray-900">
          {formatCurrency(property.price, property.currency)}
        </p>
        <h3 className="mt-1 line-clamp-1 font-semibold text-brand-gray-900">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-brand-gray-500">
          <MapPin size={14} /> {property.address}, {property.city}
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm text-brand-gray-700">
          {property.bedrooms ? (
            <span className="flex items-center gap-1">
              <BedDouble size={15} /> {property.bedrooms}
            </span>
          ) : null}
          {property.bathrooms ? (
            <span className="flex items-center gap-1">
              <Bath size={15} /> {property.bathrooms}
            </span>
          ) : null}
          {property.areaM2 ? (
            <span className="flex items-center gap-1">
              <Ruler size={15} /> {property.areaM2} m²
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
