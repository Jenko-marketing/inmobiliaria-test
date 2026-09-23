"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { qualifyLead, describePaymentProof } from "@/lib/ai/claude";
import { BILL_TYPE_LABEL } from "@/lib/format";

function revalidateAll() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/alquileres");
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/conversaciones");
}

const SAMPLE_INQUIRIES = [
  (title: string) =>
    `Hola! Vi "${title}" en el anuncio, ¿sigue disponible? ¿Cuál es el precio final?`,
  (title: string) =>
    `Buenas, me interesa "${title}". Tengo un presupuesto de USD 45.000, ¿se puede?`,
  (title: string) =>
    `Hola, quisiera coordinar una visita a "${title}" esta semana si es posible.`,
  (title: string) =>
    `Hola! ¿"${title}" acepta mascotas y tiene cochera? Necesito mudarme urgente.`,
];

const SAMPLE_CONTACTS = [
  { name: "Martina Sosa", phone: "+54 9 11 5555-1023" },
  { name: "Facundo Gómez", phone: "+54 9 11 5555-2087" },
  { name: "Lucía Fernández", phone: "+54 9 11 5555-3341" },
  { name: "Ezequiel Torres", phone: "+54 9 11 5555-4498" },
  { name: "Camila Ibáñez", phone: "+54 9 11 5555-5502" },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function simulateInquiryEvent(propertyId?: string) {
  const property = propertyId
    ? await prisma.property.findUnique({ where: { id: propertyId } })
    : await prisma.property.findFirst({
        where: { status: "DISPONIBLE" },
        orderBy: { createdAt: "desc" },
      });

  if (!property) return { ok: false as const, error: "No hay propiedades disponibles." };

  const contact = pick(SAMPLE_CONTACTS);
  const message = pick(SAMPLE_INQUIRIES)(property.title);

  const conversation = await prisma.conversation.create({
    data: {
      contactName: contact.name,
      contactPhone: contact.phone,
      kind: "VENTA",
      status: "ABIERTA",
      messages: { create: [{ direction: "IN", type: "TEXT", content: message }] },
    },
  });

  const result = await qualifyLead({
    contactName: contact.name,
    message,
    propertyTitle: property.title,
  });

  await prisma.message.create({
    data: { conversationId: conversation.id, direction: "OUT", type: "TEXT", content: result.reply },
  });

  const status = result.shouldHandoff ? "DERIVADO" : result.qualified ? "CALIFICADO" : "CALIFICANDO";

  const lead = await prisma.lead.create({
    data: {
      name: contact.name,
      phone: contact.phone,
      source: "WhatsApp",
      interest: result.summary,
      budget: result.budget,
      status,
      qualificationNotes: result.summary,
      assignedAgent: result.shouldHandoff ? "Agente disponible" : null,
      propertyId: property.id,
      conversationId: conversation.id,
    },
  });

  if (result.shouldHandoff) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { status: "ESPERANDO_HUMANO" },
    });
    await prisma.notification.create({
      data: {
        title: "Lead calificado — necesita un humano",
        body: `${contact.name} preguntó por "${property.title}" (${result.budget}). Listo para que un agente tome la conversación.`,
        kind: "LEAD_CALIFICADO",
      },
    });
  }

  revalidateAll();
  return { ok: true as const, leadId: lead.id, conversationId: conversation.id };
}

export async function simulatePaymentEvent(billId?: string) {
  const bill = billId
    ? await prisma.utilityBill.findUnique({
        where: { id: billId },
        include: { rentalContract: { include: { property: true } } },
      })
    : await prisma.utilityBill.findFirst({
        where: { status: { in: ["PENDIENTE", "VENCIDO"] } },
        orderBy: { dueDate: "asc" },
        include: { rentalContract: { include: { property: true } } },
      });

  if (!bill) return { ok: false as const, error: "No hay facturas pendientes para simular." };

  const { rentalContract } = bill;
  const billLabel = BILL_TYPE_LABEL[bill.type] ?? bill.type;

  let conversation = await prisma.conversation.findFirst({
    where: { contactPhone: rentalContract.tenantPhone, kind: "INQUILINO" },
  });
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        contactName: rentalContract.tenantName,
        contactPhone: rentalContract.tenantPhone,
        kind: "INQUILINO",
        status: "ABIERTA",
      },
    });
  }

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      direction: "IN",
      type: "IMAGE",
      content: `📎 Foto del comprobante — ${billLabel} (${bill.period})`,
    },
  });

  const note = await describePaymentProof({
    tenantName: rentalContract.tenantName,
    billType: billLabel,
    period: bill.period,
    amount: bill.amount,
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      direction: "OUT",
      type: "TEXT",
      content: `¡Gracias ${rentalContract.tenantName.split(" ")[0]}! Registramos tu pago de ${billLabel.toLowerCase()} (${bill.period}) ✅`,
    },
  });

  await prisma.utilityBill.update({
    where: { id: bill.id },
    data: { status: "PAGADO", paidAt: new Date(), proofUrl: "whatsapp://comprobante" },
  });

  await prisma.notification.create({
    data: {
      title: "Pago recibido por WhatsApp",
      body: `${note} (${rentalContract.property.title})`,
      kind: "PAGO_RECIBIDO",
    },
  });

  revalidateAll();
  return { ok: true as const, billId: bill.id, conversationId: conversation.id };
}

/** Wrappers sin argumentos para usar directamente como action de un <form>. */
export async function triggerInquirySimulation() {
  await simulateInquiryEvent();
}

export async function triggerPaymentSimulation() {
  await simulatePaymentEvent();
}
