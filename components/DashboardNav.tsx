"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Users,
  Home,
  Wallet,
  MessageCircle,
} from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/propiedades", label: "Propiedades", icon: Home },
  { href: "/dashboard/alquileres", label: "Alquileres", icon: Wallet },
  { href: "/dashboard/conversaciones", label: "Conversaciones", icon: MessageCircle },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {LINKS.map((link) => {
        const active =
          link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-brand-red text-white"
                : "text-brand-gray-300 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon size={17} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
