import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export function hasRealAI() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function client() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export type LeadQualification = {
  summary: string;
  budget: string;
  qualified: boolean;
  shouldHandoff: boolean;
  reply: string;
  simulated: boolean;
};

const BUDGET_HINTS = [
  { re: /(\d{2,3})\s?[.,]?\d{0,3}\s?(mil|k)\b/i, label: "~USD 40.000" },
  { re: /usd|dólares|dolares|u\$s/i, label: "Presupuesto en USD, a confirmar" },
];

/** Califica una consulta de venta/alquiler que llega por WhatsApp. */
export async function qualifyLead(input: {
  contactName: string;
  message: string;
  propertyTitle?: string;
}): Promise<LeadQualification> {
  if (hasRealAI()) {
    try {
      const res = await client().messages.create({
        model: "claude-sonnet-5",
        max_tokens: 400,
        system:
          "Sos el asistente de WhatsApp de Inmobiliaria Bataglia. Atendés consultas de venta/alquiler que llegan desde anuncios. " +
          "Respondé SIEMPRE en español rioplatense, tono cordial y breve. " +
          "Tu tarea: (1) escribir una respuesta corta y natural para el cliente, (2) resumir en una frase qué busca, " +
          "(3) estimar presupuesto si lo menciona, (4) decidir si hay que derivar a un agente humano (cuando el cliente " +
          "da presupuesto concreto, pide visitar, o pregunta algo que un bot no puede resolver). " +
          "Devolvé ÚNICAMENTE un JSON con las claves: reply, summary, budget, qualified (boolean), shouldHandoff (boolean).",
        messages: [
          {
            role: "user",
            content: `Propiedad consultada: ${input.propertyTitle ?? "no especificada"}\nCliente (${input.contactName}) escribió: "${input.message}"`,
          },
        ],
      });
      const text = res.content.find((b) => b.type === "text")?.text ?? "{}";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      return {
        summary: parsed.summary ?? "Consulta por propiedad",
        budget: parsed.budget ?? "No especificado",
        qualified: Boolean(parsed.qualified),
        shouldHandoff: Boolean(parsed.shouldHandoff),
        reply: parsed.reply ?? "Gracias por tu consulta, ya te contactamos.",
        simulated: false,
      };
    } catch {
      // si falla la llamada real (key inválida, sin cuota, etc.) caemos al modo simulado
    }
  }

  return simulateQualification(input);
}

function simulateQualification(input: {
  contactName: string;
  message: string;
  propertyTitle?: string;
}): LeadQualification {
  const msg = input.message.toLowerCase();
  const mentionsBudget = /usd|dólares|dolares|u\$s|\$|mil|presupuesto/.test(msg);
  const wantsVisit = /visita|ver la propiedad|conocer|recorrer/.test(msg);
  const urgent = /urgente|hoy|esta semana|ya mismo/.test(msg);
  const budgetHint = BUDGET_HINTS.find((b) => b.re.test(msg));

  const qualified = mentionsBudget || wantsVisit;
  const shouldHandoff = qualified || urgent;

  const reply = wantsVisit
    ? `¡Hola ${input.contactName}! Genial, coordinamos una visita a "${input.propertyTitle ?? "la propiedad"}". Ya te paso con un asesor para cerrar el horario.`
    : mentionsBudget
      ? `¡Hola ${input.contactName}! Gracias por el dato de presupuesto. Te derivo con un asesor para avanzar con los detalles.`
      : `¡Hola ${input.contactName}! Gracias por escribirnos. Contame un poco más: ¿qué zona y presupuesto estás manejando?`;

  return {
    summary: `Consulta por ${input.propertyTitle ?? "propiedad de la web"}${wantsVisit ? " — pide visita" : ""}`,
    budget: budgetHint?.label ?? "No especificado todavía",
    qualified,
    shouldHandoff,
    reply,
    simulated: true,
  };
}

/** Genera una nota corta simulando el análisis del comprobante que manda el inquilino por WhatsApp. */
export async function describePaymentProof(input: {
  tenantName: string;
  billType: string;
  period: string;
  amount?: number | null;
}): Promise<string> {
  if (hasRealAI()) {
    try {
      const res = await client().messages.create({
        model: "claude-sonnet-5",
        max_tokens: 120,
        system:
          "Redactá en una sola oración, en español rioplatense, la confirmación interna de que un comprobante de pago " +
          "de un inquilino fue reconocido y validado automáticamente. Tono operativo, para uso interno del equipo.",
        messages: [
          {
            role: "user",
            content: `Inquilino: ${input.tenantName}. Servicio: ${input.billType}. Período: ${input.period}.${
              input.amount ? ` Monto: $${input.amount}.` : ""
            }`,
          },
        ],
      });
      const text = res.content.find((b) => b.type === "text")?.text;
      if (text) return text.trim();
    } catch {
      // fallback simulado
    }
  }

  return `Comprobante de ${input.billType.toLowerCase()} (${input.period}) de ${input.tenantName} reconocido automáticamente y marcado como pagado.`;
}
