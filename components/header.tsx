'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, BarChart3, Clock, Bell } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Dashboard', icon: BarChart3 },
    { href: '/contratos', label: 'Contratos', icon: FileText },
    { href: '/historico', label: 'Histórico', icon: Clock },
    { href: '/notificacoes', label: 'Notificações', icon: Bell },
    { href: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between mx-auto px-4">
        {/* Logo e Título */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:inline text-foreground">ContratoBus</span>
        </Link>

        {/* Navegação */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'text-foreground hover:bg-accent'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Toggle de Tema */}
        <ThemeToggle />
      </div>
    </header>
  )
}
