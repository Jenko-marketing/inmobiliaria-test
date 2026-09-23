"use client";

import { useTransition } from "react";
import { Sparkles, Receipt } from "lucide-react";
import { triggerInquirySimulation, triggerPaymentSimulation } from "@/lib/actions/simulate";

export function SimulateButtons() {
  const [pendingInquiry, startInquiry] = useTransition();
  const [pendingPayment, startPayment] = useTransition();

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => startPayment(() => triggerPaymentSimulation())}
        disabled={pendingPayment}
        className="flex items-center gap-2 rounded-lg border border-brand-gray-300 bg-white px-4 py-2 text-sm font-semibold text-brand-gray-700 hover:border-brand-red hover:text-brand-red disabled:opacity-60"
      >
        <Receipt size={16} />
        {pendingPayment ? "Simulando..." : "Simular comprobante recibido"}
      </button>
      <button
        onClick={() => startInquiry(() => triggerInquirySimulation())}
        disabled={pendingInquiry}
        className="flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-dark disabled:opacity-60"
      >
        <Sparkles size={16} />
        {pendingInquiry ? "Simulando..." : "Simular consulta nueva"}
      </button>
    </div>
  );
}
