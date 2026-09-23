import Link from "next/link";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PropertyCard } from "@/components/PropertyCard";
import { waLink } from "@/lib/site";
import { MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    prisma.property.findMany({
      where: { featured: true, status: { in: ["DISPONIBLE", "RESERVADA"] } },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.findMany({
      where: { status: { in: ["DISPONIBLE", "RESERVADA"] } },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const shown = featured.length ? featured : latest.slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-brand-gray-950 text-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-red">
              Venta y alquiler de propiedades
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
              Encontrá tu próxima propiedad con Inmobiliaria Bataglia
            </h1>
            <p className="mt-4 max-w-xl text-brand-gray-300">
              Recorré cada propiedad con tour 360° antes de visitarla, y consultanos
              al instante por WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/propiedades"
                className="rounded-lg bg-brand-red px-5 py-3 text-sm font-semibold text-white hover:bg-brand-red-dark"
              >
                Ver propiedades
              </Link>
              <a
                href={waLink("Hola! Quiero más información sobre sus propiedades.")}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold hover:border-white"
              >
                <MessageCircle size={16} /> Consultar por WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-brand-gray-900">Destacadas</h2>
            <Link href="/propiedades" className="text-sm font-semibold text-brand-red">
              Ver todas →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
            {shown.length === 0 ? (
              <p className="col-span-full text-brand-gray-500">
                Todavía no hay propiedades cargadas.
              </p>
            ) : null}
          </div>
        </section>

        <section className="border-t border-brand-gray-200 bg-brand-gray-50">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
            <Feature
              icon={<Sparkles size={20} />}
              title="Recorrido 360°"
              text="Caminá cada propiedad desde el celular antes de agendar una visita."
            />
            <Feature
              icon={<MessageCircle size={20} />}
              title="Todo por WhatsApp"
              text="Consultá, calificamos tu búsqueda automáticamente y te derivamos con un asesor."
            />
            <Feature
              icon={<ShieldCheck size={20} />}
              title="Alquileres al día"
              text="Los inquilinos mandan sus comprobantes por WhatsApp y quedan registrados solos."
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div>
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red-light text-brand-red">
        {icon}
      </span>
      <h3 className="mt-3 font-semibold text-brand-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-brand-gray-500">{text}</p>
    </div>
  );
}
