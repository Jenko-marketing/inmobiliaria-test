import { prisma } from "@/lib/db";
import { Badge } from "@/components/Badge";
import { ChatThread } from "@/components/ChatThread";
import { SimulateButtons } from "@/components/SimulateButtons";
import { Phone } from "lucide-react";
import { clsx } from "clsx";

const STATUS_TONE: Record<string, "green" | "amber" | "blue" | "gray"> = {
  ABIERTA: "gray",
  ESPERANDO_HUMANO: "amber",
  ATENDIDA: "blue",
  CERRADA: "green",
};

const STATUS_LABEL: Record<string, string> = {
  ABIERTA: "Abierta",
  ESPERANDO_HUMANO: "Esperando humano",
  ATENDIDA: "Atendida",
  CERRADA: "Cerrada",
};

export default async function ConversacionesPage() {
  const conversations = await prisma.conversation.findMany({
    include: { messages: { orderBy: { createdAt: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-gray-900">Conversaciones de WhatsApp</h1>
          <p className="mt-1 max-w-xl text-sm text-brand-gray-500">
            Así se van a ver los hilos reales una vez conectado el número de WhatsApp. Usá los
            botones para simular en vivo cómo reacciona el sistema.
          </p>
        </div>
        <SimulateButtons />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {conversations.map((c) => (
          <div
            key={c.id}
            className="flex flex-col overflow-hidden rounded-xl border border-brand-gray-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between gap-3 border-b border-brand-gray-100 bg-brand-gray-50 px-4 py-3">
              <div>
                <p className="font-semibold text-brand-gray-900">{c.contactName}</p>
                <p className="flex items-center gap-1 text-xs text-brand-gray-500">
                  <Phone size={11} /> {c.contactPhone}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge tone={c.kind === "INQUILINO" ? "blue" : "gray"}>
                  {c.kind === "INQUILINO" ? "Inquilino" : "Consulta de venta"}
                </Badge>
                <Badge tone={STATUS_TONE[c.status] ?? "gray"}>
                  {STATUS_LABEL[c.status] ?? c.status}
                </Badge>
              </div>
            </div>
            <div
              className={clsx(
                "max-h-80 overflow-y-auto p-4",
                c.messages.length === 0 && "flex-1",
              )}
            >
              {c.messages.length > 0 ? (
                <ChatThread messages={c.messages} />
              ) : (
                <p className="text-center text-sm text-brand-gray-400">Sin mensajes todavía.</p>
              )}
            </div>
          </div>
        ))}
        {conversations.length === 0 ? (
          <p className="text-brand-gray-500">Todavía no hay conversaciones.</p>
        ) : null}
      </div>
    </div>
  );
}
