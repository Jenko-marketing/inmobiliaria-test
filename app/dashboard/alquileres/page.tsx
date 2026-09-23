import { prisma } from "@/lib/db";
import { Badge, billStatusTone } from "@/components/Badge";
import { markBillPaid, markBillPending } from "@/lib/actions/rentals";
import {
  BILL_TYPE_LABEL,
  BILL_STATUS_LABEL,
  formatCurrency,
  formatDate,
  daysUntil,
} from "@/lib/format";
import { Phone, Home } from "lucide-react";

export default async function AlquileresPage() {
  const contracts = await prisma.rentalContract.findMany({
    include: {
      property: true,
      bills: { orderBy: { dueDate: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-gray-900">Alquileres</h1>
      <p className="mt-1 text-sm text-brand-gray-500">
        Estado de pago de luz, agua, expensas y otros gastos por contrato.
      </p>

      <div className="mt-6 space-y-6">
        {contracts.map((contract) => {
          const pendientes = contract.bills.filter((b) => b.status !== "PAGADO").length;
          return (
            <div
              key={contract.id}
              className="overflow-hidden rounded-xl border border-brand-gray-200 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-gray-100 bg-brand-gray-50 px-5 py-4">
                <div>
                  <p className="flex items-center gap-2 font-semibold text-brand-gray-900">
                    <Home size={15} /> {contract.property.title}
                  </p>
                  <p className="mt-1 flex items-center gap-3 text-sm text-brand-gray-500">
                    <span>{contract.tenantName}</span>
                    <span className="flex items-center gap-1">
                      <Phone size={12} /> {contract.tenantPhone}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-brand-gray-500">
                    Alquiler mensual: {formatCurrency(contract.monthlyRent, contract.currency)}
                  </p>
                  <Badge tone={pendientes === 0 ? "green" : "amber"}>
                    {pendientes === 0 ? "Todo al día" : `${pendientes} pendiente(s)`}
                  </Badge>
                </div>
              </div>

              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-brand-gray-400">
                  <tr>
                    <th className="px-5 py-2">Servicio</th>
                    <th className="px-5 py-2">Período</th>
                    <th className="px-5 py-2">Vencimiento</th>
                    <th className="px-5 py-2">Monto</th>
                    <th className="px-5 py-2">Estado</th>
                    <th className="px-5 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gray-100">
                  {contract.bills.map((bill) => {
                    const remaining = daysUntil(bill.dueDate);
                    return (
                      <tr key={bill.id}>
                        <td className="px-5 py-3 font-medium text-brand-gray-900">
                          {BILL_TYPE_LABEL[bill.type] ?? bill.type}
                        </td>
                        <td className="px-5 py-3 text-brand-gray-600">{bill.period}</td>
                        <td className="px-5 py-3 text-brand-gray-600">
                          {formatDate(bill.dueDate)}
                          {bill.status !== "PAGADO" && remaining <= 3 && remaining >= 0 ? (
                            <span className="ml-2 text-xs font-medium text-amber-600">
                              vence en {remaining}d
                            </span>
                          ) : null}
                        </td>
                        <td className="px-5 py-3 text-brand-gray-600">
                          {bill.amount ? formatCurrency(bill.amount, contract.currency) : "—"}
                        </td>
                        <td className="px-5 py-3">
                          <Badge tone={billStatusTone(bill.status)}>
                            {BILL_STATUS_LABEL[bill.status] ?? bill.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-right">
                          {bill.status === "PAGADO" ? (
                            <form action={markBillPending.bind(null, bill.id)}>
                              <button className="text-xs text-brand-gray-400 hover:text-brand-red">
                                Deshacer
                              </button>
                            </form>
                          ) : (
                            <form action={markBillPaid.bind(null, bill.id)}>
                              <button className="rounded-lg border border-brand-gray-300 px-3 py-1 text-xs font-medium text-brand-gray-700 hover:border-brand-red hover:text-brand-red">
                                Marcar pagado
                              </button>
                            </form>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
        {contracts.length === 0 ? (
          <p className="text-brand-gray-500">Todavía no hay contratos de alquiler cargados.</p>
        ) : null}
      </div>
    </div>
  );
}
