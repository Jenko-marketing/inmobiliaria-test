import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, BedDouble, Bath, Ruler, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PanoramaViewer } from "@/components/PanoramaViewer";
import { Badge, propertyStatusTone } from "@/components/Badge";
import {
  formatCurrency,
  parseImages,
  OPERATION_LABEL,
  PROPERTY_STATUS_LABEL,
  PROPERTY_TYPE_LABEL,
} from "@/lib/format";
import { waLink } from "@/lib/site";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await prisma.property.findUnique({ where: { slug } });
  if (!property) notFound();

  const images = parseImages(property.images);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex gap-2">
                <Badge tone="gray">{OPERATION_LABEL[property.operation]}</Badge>
                <Badge tone={propertyStatusTone(property.status)}>
                  {PROPERTY_STATUS_LABEL[property.status]}
                </Badge>
                <Badge tone="gray">{PROPERTY_TYPE_LABEL[property.type]}</Badge>
              </div>
              <h1 className="mt-3 text-3xl font-bold text-brand-gray-900">
                {property.title}
              </h1>
              <p className="mt-1 flex items-center gap-1 text-brand-gray-500">
                <MapPin size={16} /> {property.address}, {property.city}
              </p>
            </div>
            <p className="text-3xl font-bold text-brand-red">
              {formatCurrency(property.price, property.currency)}
            </p>
          </div>

          {images.length > 0 ? (
            <div className="mt-8 grid grid-cols-4 gap-3">
              <div className="relative col-span-4 h-80 overflow-hidden rounded-xl bg-brand-gray-100 sm:col-span-3">
                <Image
                  src={images[0]}
                  alt={property.title}
                  fill
                  sizes="(min-width: 640px) 66vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="col-span-4 grid grid-cols-4 gap-3 sm:col-span-1 sm:grid-cols-1">
                {images.slice(1, 4).map((src) => (
                  <div
                    key={src}
                    className="relative h-24 overflow-hidden rounded-lg bg-brand-gray-100 sm:h-24"
                  >
                    <Image src={src} alt="" fill sizes="200px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex gap-6 border-b border-brand-gray-200 pb-6 text-brand-gray-700">
                {property.bedrooms ? (
                  <span className="flex items-center gap-2">
                    <BedDouble size={18} /> {property.bedrooms} dormitorios
                  </span>
                ) : null}
                {property.bathrooms ? (
                  <span className="flex items-center gap-2">
                    <Bath size={18} /> {property.bathrooms} baños
                  </span>
                ) : null}
                {property.areaM2 ? (
                  <span className="flex items-center gap-2">
                    <Ruler size={18} /> {property.areaM2} m²
                  </span>
                ) : null}
              </div>
              <h2 className="mt-6 text-lg font-semibold text-brand-gray-900">
                Descripción
              </h2>
              <p className="mt-2 whitespace-pre-line text-brand-gray-700">
                {property.description}
              </p>

              {property.panoramaUrl ? (
                <div className="mt-10">
                  <h2 className="text-lg font-semibold text-brand-gray-900">
                    Recorrido 360°
                  </h2>
                  <p className="mt-1 text-sm text-brand-gray-500">
                    Arrastrá para mirar alrededor y usá el zoom para acercarte.
                  </p>
                  <div className="mt-3">
                    <PanoramaViewer panoramaUrl={property.panoramaUrl} title={property.title} />
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="h-fit rounded-xl border border-brand-gray-200 bg-brand-gray-50 p-6">
              <p className="font-semibold text-brand-gray-900">
                ¿Te interesa esta propiedad?
              </p>
              <p className="mt-1 text-sm text-brand-gray-500">
                Escribinos por WhatsApp y te respondemos al instante.
              </p>
              <a
                href={waLink(
                  `Hola! Vi "${property.title}" (${property.address}) y quiero más información.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-brand-red px-4 py-3 text-sm font-semibold text-white hover:bg-brand-red-dark"
              >
                <MessageCircle size={16} /> Consultar por WhatsApp
              </a>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
