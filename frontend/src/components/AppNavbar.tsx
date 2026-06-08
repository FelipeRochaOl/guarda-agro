/**
 * AppNavbar — Barra de navegação principal do GuardaAgro
 */

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Chip,
} from "@heroui/react";
import { useAuth } from "../contexts/AuthContext";

export default function AppNavbar() {
  const { user, logout } = useAuth();

  return (
    <Navbar
      maxWidth="full"
      isBordered
      classNames={{
        base: "bg-[#0d1321]/80 backdrop-blur-xl border-b border-white/5",
        wrapper: "px-4 sm:px-6",
      }}
    >
      <NavbarBrand className="gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
            🌿
          </div>
          <span className="font-bold text-xl tracking-tight ga-gradient-text">
            GuardaAgro
          </span>
        </div>
        <Chip
          size="sm"
          variant="flat"
          classNames={{
            base: "bg-emerald-500/10 border border-emerald-500/20",
            content: "text-emerald-400 text-xs font-medium",
          }}
        >
          Space Connect
        </Chip>
      </NavbarBrand>

      <NavbarContent justify="end" className="gap-3">
        {user && (
          <>
            <NavbarItem className="hidden sm:flex">
              <span className="text-sm text-slate-400">
                {user.email}
              </span>
            </NavbarItem>
            <NavbarItem>
              <Button
                size="sm"
                variant="flat"
                color="danger"
                onPress={logout}
                className="font-medium"
              >
                Sair
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
