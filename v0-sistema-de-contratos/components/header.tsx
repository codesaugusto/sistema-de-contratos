"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  BarChart3,
  Clock,
  Bell,
  PieChart,
  LogOut,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/contexts/auth-context";

export function Header() {
  const pathname = usePathname();
  const { usuario, logout } = useAuthContext();

  const navItems = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/contratos", label: "Contratos", icon: FileText },
    { href: "/historico", label: "Histórico", icon: Clock },
    { href: "/relatorios", label: "Relatórios", icon: PieChart },
    { href: "/notificacoes", label: "Notificações", icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-slate-300/70 dark:border-slate-800/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
        {/* Logo e Título */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:inline text-foreground">ContratoApp</span>
        </Link>

        {/* Navegação */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                    : "text-foreground hover:bg-accent",
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Usuário + Toggle de Tema */}
        <div className="flex items-center gap-2">
          {usuario && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-500">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground max-w-[140px] truncate">
                {usuario.nome}
              </span>
            </div>
          )}
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="gap-1.5 text-black dark:text-white"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
