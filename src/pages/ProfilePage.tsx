import { useAuth } from '@/context/AuthContext'

const rolLabel: Record<string, string> = {
  admin: 'Administrador',
  cliente: 'Cliente',
}

export function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">No hay sesión activa.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Mi perfil</h1>

      <div className="border rounded-lg divide-y">
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">Nombre</span>
          <span className="text-sm font-medium">{user.nombre}</span>
        </div>

        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">Correo</span>
          <span className="text-sm font-medium">{user.correo}</span>
        </div>

        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">Rol</span>
          <span className="text-sm font-medium">
            {rolLabel[user.rol] ?? user.rol}
          </span>
        </div>

        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-sm text-muted-foreground">ID</span>
          <span className="text-xs font-mono text-muted-foreground">
            {user._id}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Para actualizar tu información contacta al administrador.
      </p>
    </div>
  )
}