"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-brand-gray-300 hover:bg-white/10 hover:text-white"
      >
        <LogOut size={17} /> Cerrar sesión
      </button>
    </form>
  );
}
