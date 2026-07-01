import { useEffect, useState } from 'react'
import { getMisPedidos } from '@/api/pedidosApi'
import { Card } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/shared'
import { Package } from 'lucide-react'

type ItemPedido = { productoId: string; nombre: string; talla: string; color: string; cantidad: number; precioUnitario: number }
type EstadoPedido = 'Pendiente' | 'Pagado' | 'Enviado' | 'Entregado'
type Pedido = { _id: string; items: ItemPedido[]; total: number; estado: EstadoPedido; tipoEntrega: string; createdAt: string }

const estadoColores: Record<EstadoPedido, string> = {
  Pendiente: 'bg-yellow-100 text-yellow-800',
  Pagado: 'bg-blue-100 text-blue-800',
  Enviado: 'bg-purple-100 text-purple-800',
  Entregado: 'bg-green-100 text-green-800',
}

function StatusBadge({ estado }: { estado: EstadoPedido }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${estadoColores[estado] ?? 'bg-gray-100 text-gray-800'}`}>
      {estado}
    </span>
  )
}

export function OrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMisPedidos()
      .then((data) => setPedidos(data.pedidos ?? []))
      .catch(() => setError('No se pudieron cargar tus pedidos.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="flex justify-center py-20"><p className="text-destructive">{error}</p></div>

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground mb-6">Mis pedidos</h1>

        {pedidos.length === 0 ? (
          <Card className="flex flex-col items-center gap-4 border-border py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Package className="h-7 w-7 text-primary" />
            </div>
            <p className="text-muted-foreground">No tienes pedidos aún.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {pedidos.map((pedido) => (
              <Card key={pedido._id} className="border-border p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground">{pedido._id}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                      {new Date(pedido.createdAt).toLocaleDateString('es-PA', { day: '2-digit', month: 'long', year: 'numeric' })}
                      {' · '}Entrega: {pedido.tipoEntrega}
                    </p>
                  </div>
                  <StatusBadge estado={pedido.estado} />
                </div>

                <div className="flex flex-col gap-1.5 border-t border-border pt-3">
                  {pedido.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">
                        {item.nombre} ({item.talla} / {item.color}) x{item.cantidad}
                      </span>
                      <span>${(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-semibold text-sm border-t border-border pt-3 mt-3">
                  <span>Total</span>
                  <span className="text-primary">${pedido.total.toFixed(2)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}