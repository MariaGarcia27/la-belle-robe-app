import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  BadgeCheck,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from 'lucide-react'

const rolLabel: Record<string, string> = {
  admin: 'Administrador',
  cliente: 'Cliente',
}

export function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [nombre, setNombre] = useState(user?.nombre ?? '')
  const [correo, setCorreo] = useState(user?.correo ?? '')
  const [telefono, setTelefono] = useState(user?.telefono ?? '')
  const [direccion, setDireccion] = useState(user?.direccion ?? '')
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showCurrentPwd, setShowCurrentPwd] = useState(false)
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-sm border-border p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <UserRound className="h-6 w-6" />
          </div>
          <p className="font-medium text-foreground">No hay sesión activa</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Inicia sesión para ver los datos de tu perfil.
          </p>
        </Card>
      </div>
    )
  }

  const initials = user.nombre?.slice(0, 2).toUpperCase() ?? 'U'
  const role = rolLabel[user.rol] ?? user.rol

  function handleCancel() {
    setNombre(user?.nombre ?? '')
    setCorreo(user?.correo ?? '')
    setTelefono(user?.telefono ?? '')
    setDireccion(user?.direccion ?? '')
    setNewPwd('')
    setConfirmPwd('')
    setCurrentPwd('')
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()

    if (newPwd && newPwd.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    if (newPwd && newPwd !== confirmPwd) {
      toast.error('Las contraseñas nuevas no coinciden')
      return
    }

    if (newPwd && !currentPwd) {
      toast.error('Ingresa tu contraseña actual para poder cambiarla')
      return
    }

    setSaving(true)

    try {
      await updateUser({
        nombre,
        correo,
        telefono,
        direccion,
        ...(newPwd
          ? { password: newPwd, passwordActual: currentPwd }
          : {}),
      })

      setCurrentPwd('')
      setNewPwd('')
      setConfirmPwd('')
      toast.success('Perfil actualizado correctamente')
    } catch (err: any) {
      const mensaje =
        err?.response?.data?.mensaje ?? 'No se pudo actualizar el perfil'
      toast.error(mensaje)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-6">
          <p className="text-sm font-medium text-primary">Cuenta</p>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Mi perfil
          </h1>
        </div>

        <Card className="overflow-hidden border-border bg-background p-0 shadow-sm">
          <div className="bg-primary/10 px-6 py-8">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary text-3xl font-semibold text-primary-foreground shadow-sm">
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <h2 className="truncate font-serif text-2xl font-semibold text-foreground">
                    {user.nombre}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/20">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {role}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{user.correo}</span>
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
                <Label htmlFor="nombre">
                  <UserRound className="h-3.5 w-3.5" /> Nombre completo
                </Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo">
                  <Mail className="h-3.5 w-3.5" /> Correo electrónico
                </Label>
                <Input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">
                  <Phone className="h-3.5 w-3.5" /> Teléfono
                </Label>
                <Input
                  id="telefono"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Opcional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">
                  <MapPin className="h-3.5 w-3.5" /> Dirección
                </Label>
                <Input
                  id="direccion"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Opcional"
                />
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
            {/* Contraseña actual */}
            <div className="space-y-2">
              <Label htmlFor="currentPwd">Contraseña actual</Label>
              <div className="relative">
                <Input
                  id="currentPwd"
                  type={showCurrentPwd ? 'text' : 'password'}
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPwd((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={showCurrentPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showCurrentPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div className="space-y-2">
              <Label htmlFor="newPwd">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="newPwd"
                  type={showNewPwd ? 'text' : 'password'}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={showNewPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showNewPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-2">
              <Label htmlFor="confirmPwd">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPwd"
                  type={showConfirmPwd ? 'text' : 'password'}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={showConfirmPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPwd ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
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
                className="flex-1"
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}