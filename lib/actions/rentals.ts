"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function revalidateAll() {
  revalidatePath("/dashboard/alquileres");
  revalidatePath("/dashboard");
}

export async function markBillPaid(billId: string) {
  await prisma.utilityBill.update({
    where: { id: billId },
    data: { status: "PAGADO", paidAt: new Date() },
  });
  revalidateAll();
}

export async function markBillPending(billId: string) {
  await prisma.utilityBill.update({
    where: { id: billId },
    data: { status: "PENDIENTE", paidAt: null },
  });
  revalidateAll();
}
