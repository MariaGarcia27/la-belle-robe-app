import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Package, UserRound, LogOut, ChevronDown, Bell } from 'lucide-react'
import { Logo } from '@/components/shared'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

export function ClientNavbar() {
  const navigate = useNavigate()
  const { cartCount } = useCart()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cierra el menú si se hace click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.nombre?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link to="/catalogo" className="shrink-0">
          <Logo />
        </Link>

        {/* Bienvenida (solo desktop) */}
        <p className="hidden text-sm text-muted-foreground md:block">
          Bienvenida,{' '}
          <span className="font-medium text-foreground">{user?.nombre}</span>
        </p>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Carrito */}
          <Link
            to="/carrito"
            aria-label="Carrito"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Notificaciones (decorativo por ahora) */}
          <button
            aria-label="Notificaciones"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-secondary ring-2 ring-background" />
          </button>

          {/* Menú de usuario */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-lg py-1 pl-1.5 pr-2 text-foreground transition-colors hover:bg-muted"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {initials}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-lg border border-border bg-popover py-1 shadow-md">
                <p className="px-3 py-2 text-sm font-medium text-foreground">
                  {user?.nombre}
                </p>
                <div className="my-1 border-t border-border" />
                <Link
                  to="/perfil"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <UserRound className="h-4 w-4" />
                  Mi perfil
                </Link>
                <Link
                  to="/pedidos"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  <Package className="h-4 w-4" />
                  Mis pedidos
                </Link>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive transition-colors hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}