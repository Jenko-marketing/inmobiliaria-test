import Link from "next/link";
import { Users, Home, AlertTriangle, MessageCircle, Bell } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export default async function DashboardHome() {
  const [leadsNuevos, propiedadesDisponibles, facturasPendientes, esperandoHumano, notifications] =
    await Promise.all([
      prisma.lead.count({ where: { status: { in: ["NUEVO", "CALIFICANDO"] } } }),
      prisma.property.count({ where: { status: "DISPONIBLE" } }),
      prisma.utilityBill.count({ where: { status: { in: ["PENDIENTE", "VENCIDO"] } } }),
      prisma.conversation.count({ where: { status: "ESPERANDO_HUMANO" } }),
      prisma.notification.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    ]);

  const cards = [
    { label: "Leads nuevos", value: leadsNuevos, icon: Users, href: "/dashboard/leads" },
    { label: "Propiedades disponibles", value: propiedadesDisponibles, icon: Home, href: "/dashboard/propiedades" },
    { label: "Facturas pendientes", value: facturasPendientes, icon: AlertTriangle, href: "/dashboard/alquileres" },
    { label: "Esperando un humano", value: esperandoHumano, icon: MessageCircle, href: "/dashboard/conversaciones" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-gray-900">Resumen</h1>
      <p className="mt-1 text-sm text-brand-gray-500">
        Estado general de leads, propiedades y alquileres.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-brand-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red-light text-brand-red">
              <card.icon size={18} />
            </span>
            <p className="mt-4 text-3xl font-bold text-brand-gray-900">{card.value}</p>
            <p className="mt-1 text-sm text-brand-gray-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-brand-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Bell size={17} className="text-brand-red" />
          <h2 className="font-semibold text-brand-gray-900">Notificaciones recientes</h2>
        </div>
        <div className="mt-4 divide-y divide-brand-gray-100">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-start justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium text-brand-gray-900">{n.title}</p>
                <p className="text-sm text-brand-gray-500">{n.body}</p>
              </div>
              <span className="shrink-0 text-xs text-brand-gray-400">
                {formatDateTime(n.createdAt)}
              </span>
            </div>
          ))}
          {notifications.length === 0 ? (
            <p className="py-6 text-center text-sm text-brand-gray-500">
              Todavía no hay notificaciones. Probá los botones &quot;Simular&quot; en
              Conversaciones.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
