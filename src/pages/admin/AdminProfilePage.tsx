import { useState } from 'react'
import { toast } from 'sonner'
import {
  CalendarDays,
  Camera,
  Fingerprint,
  Mail,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { AdminLayout } from '@/components/AdminLayout'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const rolLabel: Record<string, string> = {
  admin: 'Administrador',
  cliente: 'Cliente',
}

export function AdminProfilePage() {
  const { user, updateUser } = useAuth()

  const [nombre, setNombre] = useState(user?.nombre ?? '')
  const [correo, setCorreo] = useState(user?.correo ?? '')
  const [telefono, setTelefono] = useState(user?.telefono ?? '')
  const [direccion, setDireccion] = useState(user?.direccion ?? '')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [saving, setSaving] = useState(false)

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <p className="text-muted-foreground">No hay sesión activa.</p>
        </div>
      </AdminLayout>
    )
  }

  const initials = user.nombre?.slice(0, 2).toUpperCase() ?? 'U'
  const role = rolLabel[user.rol] ?? user.rol
  const userId = (user as any)._id ?? (user as any).id ?? 'N/A'

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()

    if (newPwd && newPwd.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (newPwd && newPwd !== confirmPwd) {
      toast.error('Las contraseñas nuevas no coinciden')
      return
    }

    setSaving(true)

    try {
      await updateUser({
        nombre,
        correo,
        telefono,
        direccion,
        ...(newPwd ? { password: newPwd } : {}),
      })

      setNewPwd('')
      setConfirmPwd('')
      toast.success('Cambios guardados correctamente')
    } catch (err: any) {
      const mensaje =
        err?.response?.data?.mensaje ?? 'No se pudieron guardar los cambios'
      toast.error(mensaje)
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setNombre(user?.nombre ?? '')
    setCorreo(user?.correo ?? '')
    setTelefono(user?.telefono ?? '')
    setDireccion(user?.direccion ?? '')
    setNewPwd('')
    setConfirmPwd('')
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Mi perfil
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Administra tu información de administrador y seguridad.
          </p>
        </header>

        <Card className="overflow-hidden border-primary/20 p-0 shadow-sm">
          <div className="bg-primary/10 px-6 py-8">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-primary/15 text-3xl font-semibold text-primary shadow-sm">
                  {initials}
                </div>

                <button
                  type="button"
                  onClick={() => toast.info('Cambio de foto próximamente')}
                  className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90"
                  aria-label="Cambiar foto de perfil"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  {user.nombre}
                </h2>

                <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {role}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border">
                    <Mail className="h-3.5 w-3.5" />
                    {user.correo}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-6 sm:p-8">
            <h3 className="font-serif text-lg font-medium text-foreground">
              Datos personales
            </h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin-nombre">Nombre completo</Label>
                <Input
                  id="admin-nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="border-primary/30 focus-visible:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-correo">Correo electrónico</Label>
                <Input
                  id="admin-correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="border-primary/30 focus-visible:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-telefono">Teléfono</Label>
                <Input
                  id="admin-telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Opcional"
                  className="border-primary/30 focus-visible:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-direccion">Dirección</Label>
                <Input
                  id="admin-direccion"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Opcional"
                  className="border-primary/30 focus-visible:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label>Rol</Label>
                <div className="flex h-9 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground">
                  {role}
                </div>
              </div>

              <div className="space-y-2">
                <Label>ID</Label>
                <div className="flex h-9 items-center rounded-lg border border-border bg-muted/40 px-3 font-mono text-xs text-muted-foreground">
                  <span className="truncate">{userId}</span>
                </div>
              </div>
            </div>

            <div className="my-8 h-px bg-border" />

            <h3 className="font-serif text-lg font-medium text-foreground">
              Cambiar contraseña
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Deja estos campos vacíos si no quieres cambiar tu contraseña.
            </p>

            <div className="mt-4 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPwd">Nueva contraseña</Label>
                  <Input
                    id="newPwd"
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    placeholder="••••••••"
                    className="border-primary/30 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPwd">Confirmar contraseña</Label>
                  <Input
                    id="confirmPwd"
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder="••••••••"
                    className="border-primary/30 focus-visible:border-primary"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card className="flex flex-col gap-2 border-primary/20 bg-background p-4">
            <UserRound className="h-5 w-5 text-primary" />
            <p className="font-serif text-xl font-semibold text-foreground">
              {role}
            </p>
            <p className="text-xs text-muted-foreground">Tipo de cuenta</p>
          </Card>

          <Card className="flex flex-col gap-2 border-primary/20 bg-background p-4">
            <CalendarDays className="h-5 w-5 text-primary" />
            <p className="font-serif text-xl font-semibold text-foreground">
              Activa
            </p>
            <p className="text-xs text-muted-foreground">Estado de sesión</p>
          </Card>

          <Card className="flex flex-col gap-2 border-primary/20 bg-background p-4">
            <Fingerprint className="h-5 w-5 text-primary" />
            <p className="font-serif text-xl font-semibold text-foreground">
              Admin
            </p>
            <p className="text-xs text-muted-foreground">Acceso del sistema</p>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}