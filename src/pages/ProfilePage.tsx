import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/card'
import { UserRound } from 'lucide-react'

const rolLabel: Record<string, string> = {
  admin: 'Administrador',
  cliente: 'Cliente',
}

export function ProfilePage() {
  const { user } = useAuth()

  if (!user) return (
    <div className="flex justify-center py-20">
      <p className="text-muted-foreground">No hay sesión activa.</p>
    </div>
  )

  const initials = user.nombre?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-md px-4 py-8 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-6">Mi perfil</h1>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-2xl font-semibold text-primary">
            {initials}
          </div>
          <p className="mt-3 font-medium text-foreground">{user.nombre}</p>
          <p className="text-sm text-muted-foreground">{rolLabel[user.rol] ?? user.rol}</p>
        </div>

        <Card className="border-border divide-y divide-border">
          <div className="flex items-center gap-3 px-5 py-4">
            <UserRound className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex flex-1 justify-between">
              <span className="text-sm text-muted-foreground">Nombre</span>
              <span className="text-sm font-medium">{user.nombre}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="h-4 w-4 shrink-0" />
            <div className="flex flex-1 justify-between">
              <span className="text-sm text-muted-foreground">Correo</span>
              <span className="text-sm font-medium">{user.correo}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="h-4 w-4 shrink-0" />
            <div className="flex flex-1 justify-between">
              <span className="text-sm text-muted-foreground">Rol</span>
              <span className="text-sm font-medium">{rolLabel[user.rol] ?? user.rol}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="h-4 w-4 shrink-0" />
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-sm text-muted-foreground">ID</span>
              <span className="text-xs font-mono text-muted-foreground break-all">
                {(user as any)._id ?? (user as any).id ?? 'N/A'}
              </span>
            </div>
          </div>
        </Card>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Para actualizar tu información contacta al administrador.
        </p>
      </main>
    </div>
  )
}