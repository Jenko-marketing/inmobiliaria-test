export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function daysUntil(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const ms = d.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export const PROPERTY_TYPE_LABEL: Record<string, string> = {
  CASA: "Casa",
  DEPARTAMENTO: "Departamento",
  LOCAL: "Local comercial",
  TERRENO: "Terreno",
  OTRO: "Otro",
};

export const OPERATION_LABEL: Record<string, string> = {
  VENTA: "Venta",
  ALQUILER: "Alquiler",
};

export const PROPERTY_STATUS_LABEL: Record<string, string> = {
  DISPONIBLE: "Disponible",
  RESERVADA: "Reservada",
  VENDIDA: "Vendida",
  ALQUILADA: "Alquilada",
};

export const LEAD_STATUS_LABEL: Record<string, string> = {
  NUEVO: "Nuevo",
  CALIFICANDO: "Calificando",
  CALIFICADO: "Calificado",
  DERIVADO: "Derivado a humano",
  DESCARTADO: "Descartado",
  CONVERTIDO: "Convertido",
};

export const BILL_TYPE_LABEL: Record<string, string> = {
  LUZ: "Luz",
  AGUA: "Agua",
  EXPENSAS: "Expensas",
  GAS: "Gas",
  INTERNET: "Internet",
  OTRO: "Otro",
};

export const BILL_STATUS_LABEL: Record<string, string> = {
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  VENCIDO: "Vencido",
};
