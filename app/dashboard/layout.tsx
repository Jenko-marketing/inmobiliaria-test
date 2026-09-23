import { Building2 } from "lucide-react";
import { requireSession } from "@/lib/auth";
import { DashboardNav } from "@/components/DashboardNav";
import { LogoutButton } from "@/components/LogoutButton";
import { SITE_NAME } from "@/lib/site";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  return (
    <div className="flex min-h-screen flex-1 bg-brand-gray-50">
      <aside className="flex w-64 shrink-0 flex-col bg-brand-gray-950 px-4 py-6">
        <div className="flex items-center gap-2 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red text-white">
            <Building2 size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-white leading-tight">{SITE_NAME}</p>
            <p className="text-xs text-brand-gray-500">Panel interno</p>
          </div>
        </div>

        <div className="mt-8 flex-1">
          <DashboardNav />
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="truncate px-3 text-xs text-brand-gray-500">{session.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
