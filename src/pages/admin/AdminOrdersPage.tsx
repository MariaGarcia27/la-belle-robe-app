import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'
import { AdminLayout } from '@/components/AdminLayout'
import { StatusBadge, formatPrice, LoadingSpinner } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getAllPedidos, updateEstado } from '@/api/pedidosApi'

type EstadoPedido = 'Pendiente' | 'Pagado' | 'Enviado' | 'Entregado'
type Pedido = {
  _id: string
  usuarioId?: { nombre?: string; correo?: string } | string
  total: number
  estado: EstadoPedido
  createdAt: string
}

const ESTADOS: EstadoPedido[] = ['Pendiente', 'Pagado', 'Enviado', 'Entregado']

export function AdminOrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [drafts, setDrafts] = useState<Record<string, EstadoPedido>>({})
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const cargar = () => {
    setLoading(true)
    getAllPedidos()
      .then((data) => setPedidos(data.pedidos ?? []))
      .catch(() => setError('No se pudieron cargar los pedidos.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    cargar()
  }, [])

  const clienteNombre = (pedido: Pedido) => {
    if (pedido.usuarioId && typeof pedido.usuarioId === 'object') {
      return pedido.usuarioId.nombre ?? pedido.usuarioId.correo ?? 'Cliente'
    }
    return 'Cliente'
  }

  async function handleUpdate(pedido: Pedido) {
    const nuevoEstado = drafts[pedido._id] ?? pedido.estado
    if (nuevoEstado === pedido.estado) return

    setUpdatingId(pedido._id)
    try {
      await updateEstado(pedido._id, nuevoEstado)
      toast.success(`Pedido #${pedido._id.slice(-6)} actualizado`)
      setPedidos((prev) =>
        prev.map((p) =>
          p._id === pedido._id ? { ...p, estado: nuevoEstado } : p,
        ),
      )
    } catch {
      toast.error('No se pudo actualizar el estado del pedido')
    } finally {
      setUpdatingId(null)
    }
  }

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
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Pedidos
        </h1>
        <p className="text-sm text-muted-foreground">
          Administra y actualiza el estado de los pedidos.
        </p>
      </header>

      <Card className="overflow-hidden border-border p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary/15 text-left">
              <tr className="text-foreground">
                <th className="px-4 py-3 font-medium">Pedido</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">
                  Cliente
                </th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">
                  Fecha
                </th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Cambiar estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                    No hay pedidos registrados todavía.
                  </td>
                </tr>
              ) : (
                pedidos.map((p) => {
                  const draft = drafts[p._id] ?? p.estado
                  return (
                    <tr key={p._id} className="border-t border-border hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium text-foreground">
                        #{p._id.slice(-6)}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {clienteNombre(p)}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                        {new Date(p.createdAt).toLocaleDateString('es-PA', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3 font-medium text-primary">
                        {formatPrice(p.total)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge estado={p.estado} />
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={draft}
                          onValueChange={(v) =>
                            setDrafts((d) => ({ ...d, [p._id]: v as EstadoPedido }))
                          }
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ESTADOS.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          disabled={draft === p.estado || updatingId === p._id}
                          onClick={() => handleUpdate(p)}
                        >
                          <RefreshCw className="mr-1 h-3.5 w-3.5" />
                          {updatingId === p._id ? 'Actualizando...' : 'Actualizar'}
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  )
}