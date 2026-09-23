"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "@/lib/actions/leads";
import { LEAD_STATUS_LABEL } from "@/lib/format";

const STATUSES = Object.keys(LEAD_STATUS_LABEL);

export function LeadStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => startTransition(() => updateLeadStatus(id, e.target.value))}
      className="rounded-lg border border-brand-gray-300 bg-white px-2 py-1 text-xs font-medium text-brand-gray-700 disabled:opacity-60"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {LEAD_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
