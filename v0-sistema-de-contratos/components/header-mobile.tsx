"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  BarChart3,
  Clock,
  Bell,
  Menu,
  X,
  Home,
  PieChart,
  LogOut,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuthContext } from "@/contexts/auth-context";

export function HeaderMobile() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { usuario, logout } = useAuthContext();

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/contratos", label: "Contratos", icon: FileText },
    { href: "/historico", label: "Histórico", icon: Clock },
    { href: "/relatorios", label: "Relatórios", icon: PieChart },
    { href: "/notificacoes", label: "Notificações", icon: Bell },
  ];

  // Obter o título da página atual
  const getCurrentPageTitle = () => {
    const item = navItems.find((nav) => nav.href === pathname);
    return item ? item.label : "ContratoApp";
  };

  return (
    <>
      {/* Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 shadow-lg">
        <div className="flex h-20 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-white"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight">
                ContratoApp
              </span>
              <span className="text-xs text-blue-100 font-medium">
                {getCurrentPageTitle()}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-blue-500/30 transition-colors duration-200"
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <nav className="absolute top-full inset-x-0 z-50 bg-blue-700 dark:bg-blue-800 border-t border-blue-600 py-2 shadow-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-600 dark:bg-blue-700 text-white border-l-4 border-l-white"
                      : "text-blue-50 hover:bg-blue-600/50",
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Separador e info do usuário */}
            <div className="border-t border-blue-600 mt-1 pt-1">
              {usuario && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {usuario.nome}
                    </p>
                    <p className="text-xs text-blue-200 truncate">
                      {usuario.email}
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-black dark:text-white"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="flex justify-around items-center h-20">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full py-2 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="hidden xs:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
