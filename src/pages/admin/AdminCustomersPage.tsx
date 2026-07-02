import { useEffect, useMemo, useState } from 'react'
import { Search, UserX } from 'lucide-react'
import { AdminLayout } from '@/components/AdminLayout'
import { LoadingSpinner } from '@/components/shared'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getUsuarios } from '@/api/authApi'

type Usuario = {
  _id: string
  nombre: string
  correo: string
  rol: 'admin' | 'cliente'
  telefono?: string
  direccion?: string
  activo: boolean
}

export function AdminCustomersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    getUsuarios()
      .then((data) => setUsuarios(data.usuarios ?? []))
      .catch(() => setError('No se pudieron cargar los clientes.'))
      .finally(() => setLoading(false))
  }, [])

  const clientes = useMemo(
    () => usuarios.filter((u) => u.rol === 'cliente'),
    [usuarios],
  )

  const filtrados = useMemo(() => {
    const q = query.toLowerCase()
    return clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.correo.toLowerCase().includes(q),
    )
  }, [clientes, query])

  const initials = (nombre: string) =>
    nombre
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <p className="text-destructive">{error}</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Clientes
          </h1>
          <p className="text-sm text-muted-foreground">
            Base de datos de clientas de la boutique.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
          <Input
            placeholder="Buscar por nombre o correo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 sm:w-64"
          />
        </div>
      </header>

      {filtrados.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 border-border py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <UserX className="h-7 w-7 text-primary" />
          </div>
          <p className="text-muted-foreground">
            No encontramos clientes con ese nombre o correo.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden border-border p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary/15 text-left">
                <tr className="text-foreground">
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Teléfono
                  </th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">
                    Dirección
                  </th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c) => (
                  <tr key={c._id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
                            {initials(c.nombre)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{c.nombre}</p>
                          <p className="text-xs text-muted-foreground">{c.correo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {c.telefono || '—'}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                      {c.direccion || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          c.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {c.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </AdminLayout>
  )
}
