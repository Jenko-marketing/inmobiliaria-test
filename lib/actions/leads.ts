"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function revalidateAll() {
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard");
}

export async function updateLeadStatus(id: string, status: string) {
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidateAll();
}

export async function assignAgent(id: string, agent: string) {
  await prisma.lead.update({
    where: { id },
    data: { assignedAgent: agent, status: "DERIVADO" },
  });
  revalidateAll();
}

export async function createLead(formData: FormData) {
  await prisma.lead.create({
    data: {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      source: String(formData.get("source") ?? "Manual"),
      interest: String(formData.get("interest") ?? "") || null,
      status: "NUEVO",
    },
  });
  revalidateAll();
}
