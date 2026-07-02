import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { StatusBadge, formatPrice, LoadingSpinner } from '@/components/shared'
import { Card } from '@/components/ui/card'
import { getProductos } from '@/api/productosApi'
import { getAllPedidos } from '@/api/pedidosApi'
import { getUsuarios } from '@/api/authApi'
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react'

type EstadoPedido = 'Pendiente' | 'Pagado' | 'Enviado' | 'Entregado'
type Pedido = {
  _id: string
  usuarioId?: { nombre?: string; correo?: string } | string
  total: number
  estado: EstadoPedido
  createdAt: string
}
type Producto = { _id: string; activo: boolean }
type Usuario = { _id: string; rol: string }

export function AdminDashboard() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getProductos(), getAllPedidos(), getUsuarios()])
      .then(([prodData, pedData, userData]) => {
        setProductos(prodData.productos ?? [])
        setPedidos(pedData.pedidos ?? [])
        setUsuarios(userData.usuarios ?? [])
      })
      .catch(() => setError('No se pudieron cargar las estadísticas.'))
      .finally(() => setLoading(false))
  }, [])

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

  const productosActivos = productos.filter((p) => p.activo).length
  const totalClientes = usuarios.filter((u) => u.rol === 'cliente').length
  const ingresos = pedidos.reduce((sum, p) => sum + p.total, 0)

  const stats = [
    {
      label: 'Ingresos totales',
      value: formatPrice(ingresos),
      icon: DollarSign,
      tint: 'bg-primary/15 text-primary',
    },
    {
      label: 'Pedidos',
      value: pedidos.length.toString(),
      icon: ShoppingBag,
      tint: 'bg-secondary text-secondary-foreground',
    },
    {
      label: 'Productos activos',
      value: productosActivos.toString(),
      icon: Package,
      tint: 'bg-primary/15 text-primary',
    },
    {
      label: 'Clientes',
      value: totalClientes.toString(),
      icon: Users,
      tint: 'bg-secondary text-secondary-foreground',
    },
  ]

  const ultimosPedidos = [...pedidos]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const clienteNombre = (pedido: Pedido) => {
    if (pedido.usuarioId && typeof pedido.usuarioId === 'object') {
      return pedido.usuarioId.nombre ?? pedido.usuarioId.correo ?? 'Cliente'
    }
    return 'Cliente'
  }

  return (
    <AdminLayout>
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Panel de administración
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumen general de tu boutique La Belle Robe.
        </p>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border-border p-5">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${s.tint}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {s.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Recent orders */}
      <Card className="mt-6 border-border p-6">
        <h2 className="font-serif text-lg font-semibold text-foreground">
          Últimos pedidos
        </h2>
        {ultimosPedidos.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Aún no hay pedidos registrados.
          </p>
        ) : (
          <div className="mt-4 flex flex-col divide-y divide-border">
            {ultimosPedidos.map((p) => (
              <div key={p._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    #{p._id.slice(-6)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {clienteNombre(p)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {formatPrice(p.total)}
                  </span>
                  <StatusBadge estado={p.estado} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AdminLayout>
  )
}
