"use client";

import { useTransition } from "react";
import { updatePropertyStatus } from "@/lib/actions/properties";
import { PROPERTY_STATUS_LABEL } from "@/lib/format";

const STATUSES = Object.keys(PROPERTY_STATUS_LABEL);

export function PropertyStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => startTransition(() => updatePropertyStatus(id, e.target.value))}
      className="rounded-lg border border-brand-gray-300 bg-white px-2 py-1 text-xs font-medium text-brand-gray-700 disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {PROPERTY_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
