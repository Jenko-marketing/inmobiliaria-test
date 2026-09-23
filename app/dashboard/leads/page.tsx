import { prisma } from "@/lib/db";
import { Badge, leadStatusTone } from "@/components/Badge";
import { LeadStatusSelect } from "@/components/LeadStatusSelect";
import { createLead } from "@/lib/actions/leads";
import { LEAD_STATUS_LABEL, formatDateTime } from "@/lib/format";
import { Phone, Home } from "lucide-react";

const COLUMNS = ["NUEVO", "CALIFICANDO", "CALIFICADO", "DERIVADO", "CONVERTIDO", "DESCARTADO"];

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    include: { property: true },
    orderBy: { createdAt: "desc" },
  });

  const byStatus = Object.fromEntries(COLUMNS.map((c) => [c, leads.filter((l) => l.status === c)]));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-brand-gray-500">
            Seguimiento de consultas y calificación automática por WhatsApp.
          </p>
        </div>
        <form action={createLead} className="flex flex-wrap gap-2">
          <input
            name="name"
            placeholder="Nombre"
            required
            className="w-36 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm"
          />
          <input
            name="phone"
            placeholder="Teléfono"
            required
            className="w-36 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm"
          />
          <input
            name="interest"
            placeholder="Interés"
            className="w-40 rounded-lg border border-brand-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-red px-3 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark"
          >
            + Lead manual
          </button>
        </form>
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((status) => (
          <div key={status} className="w-72 shrink-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-brand-gray-700">
                {LEAD_STATUS_LABEL[status]}
              </h2>
              <span className="text-xs text-brand-gray-400">{byStatus[status].length}</span>
            </div>
            <div className="space-y-3">
              {byStatus[status].map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-xl border border-brand-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-brand-gray-900">{lead.name}</p>
                    <Badge tone={leadStatusTone(lead.status)}>{lead.source}</Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-brand-gray-500">
                    <Phone size={12} /> {lead.phone}
                  </p>
                  {lead.property ? (
                    <p className="mt-1 flex items-center gap-1 text-xs text-brand-gray-500">
                      <Home size={12} /> {lead.property.title}
                    </p>
                  ) : null}
                  {lead.interest ? (
                    <p className="mt-2 text-sm text-brand-gray-700">{lead.interest}</p>
                  ) : null}
                  {lead.budget ? (
                    <p className="mt-1 text-xs font-medium text-brand-gray-500">
                      Presupuesto: {lead.budget}
                    </p>
                  ) : null}
                  {lead.assignedAgent ? (
                    <p className="mt-1 text-xs font-medium text-brand-red">
                      → {lead.assignedAgent}
                    </p>
                  ) : null}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-brand-gray-400">
                      {formatDateTime(lead.createdAt)}
                    </span>
                    <LeadStatusSelect id={lead.id} status={lead.status} />
                  </div>
                </div>
              ))}
              {byStatus[status].length === 0 ? (
                <p className="rounded-xl border border-dashed border-brand-gray-200 p-4 text-center text-xs text-brand-gray-400">
                  Sin leads
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
