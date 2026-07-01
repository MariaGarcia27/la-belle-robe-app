import { useEffect, useState } from 'react'
import { getMisPedidos } from '@/api/pedidosApi'

type ItemPedido = {
  productoId: string
  nombre: string
  talla: string
  color: string
  cantidad: number
  precioUnitario: number
}

type Pedido = {
  _id: string
  items: ItemPedido[]
  total: number
  estado: 'Pendiente' | 'Pagado' | 'Enviado' | 'Entregado'
  tipoEntrega: 'domicilio' | 'tienda'
  createdAt: string
}

const estadoColores: Record<Pedido['estado'], string> = {
  Pendiente: 'bg-yellow-100 text-yellow-800',
  Pagado: 'bg-blue-100 text-blue-800',
  Enviado: 'bg-purple-100 text-purple-800',
  Entregado: 'bg-green-100 text-green-800',
}

function StatusBadge({ estado }: { estado: Pedido['estado'] }) {
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${estadoColores[estado] ?? 'bg-gray-100 text-gray-800'}`}
    >
      {estado}
    </span>
  )
}

export function OrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await getMisPedidos()
        setPedidos(data.pedidos ?? [])
      } catch {
        setError('No se pudieron cargar tus pedidos.')
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Cargando pedidos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (pedidos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">No tienes pedidos aún.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Mis pedidos</h1>

      <div className="space-y-4">
        {pedidos.map((pedido) => (
          <div key={pedido._id} className="border rounded-lg p-5">
            {/* Cabecera del pedido */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground font-mono">
                  {pedido._id}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                  {new Date(pedido.createdAt).toLocaleDateString('es-PA', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  · Entrega: {pedido.tipoEntrega}
                </p>
              </div>
              <StatusBadge estado={pedido.estado} />
            </div>

            {/* Items del pedido */}
            <div className="space-y-1.5 border-t pt-3">
              {pedido.items.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {item.nombre}{' '}
                    <span className="capitalize">
                      ({item.talla} / {item.color})
                    </span>{' '}
                    x{item.cantidad}
                  </span>
                  <span>
                    ${(item.precioUnitario * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between font-semibold text-sm border-t pt-3 mt-3">
              <span>Total</span>
              <span>${pedido.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}