import { clsx } from "clsx";

type Tone = "green" | "red" | "amber" | "gray" | "blue";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  red: "bg-brand-red-light text-brand-red-dark ring-brand-red/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  gray: "bg-brand-gray-100 text-brand-gray-700 ring-brand-gray-300",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
};

export function Badge({
  children,
  tone = "gray",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function billStatusTone(status: string): Tone {
  if (status === "PAGADO") return "green";
  if (status === "VENCIDO") return "red";
  return "amber";
}

export function leadStatusTone(status: string): Tone {
  if (status === "CALIFICADO" || status === "CONVERTIDO") return "green";
  if (status === "DERIVADO") return "blue";
  if (status === "DESCARTADO") return "red";
  return "gray";
}

export function propertyStatusTone(status: string): Tone {
  if (status === "DISPONIBLE") return "green";
  if (status === "RESERVADA") return "amber";
  return "gray";
}
