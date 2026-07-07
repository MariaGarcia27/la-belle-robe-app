import type { ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Users,
  UserRound,
  LogOut,
} from 'lucide-react'
import { Logo } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const links = [
  { to: '/admin', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/admin/productos', label: 'Productos', icon: ShoppingBag, end: false },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ClipboardList, end: false },
  { to: '/admin/clientes', label: 'Clientes', icon: Users, end: false },
  { to: '/admin/perfil', label: 'Perfil', icon: UserRound, end: true },

]

function isRouteActive(pathname: string, to: string, end?: boolean) {
  if (end) return pathname === to

  return pathname === to || pathname.startsWith(`${to}/`)
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-muted/40 md:flex md:h-screen md:overflow-hidden">
      {/* Barra superior — solo móvil: logo + cerrar sesión (en desktop el logout vive en el sidebar) */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background px-4 py-3 shadow-sm md:hidden">
        <Logo />
        <button
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-sidebar shadow-[0_-2px_8px_rgba(0,0,0,0.06)] md:sticky md:top-0 md:z-40 md:h-screen md:w-64 md:shrink-0 md:flex-col md:border-r md:border-t-0 md:shadow-none">
        <div className="hidden items-center px-6 py-5 md:flex">
          <Logo />
        </div>

        <nav className="flex flex-1 justify-around gap-1 p-2 md:flex-col md:justify-start md:px-3 md:py-2">
          {links.map((link) => {
            const Icon = link.icon
            const active = isRouteActive(pathname, link.to, link.end)

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition md:flex-row md:gap-3 md:text-sm',
                active
                  ? 'bg-pink-100 text-pink-700'
                  : 'text-sidebar-foreground hover:bg-pink-50 hover:text-pink-700',
              )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="hidden border-t border-sidebar-border p-3 md:block">
          <div className="mb-2 truncate px-2 text-xs text-muted-foreground">
            {user?.nombre}
          </div>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1 overflow-x-hidden px-4 pb-24 pt-6 md:h-screen md:overflow-y-auto md:px-8 md:pb-8">
        {children}
      </main>
    </div>
  )
}