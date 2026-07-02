import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type ItemPedido = { productoId: string; nombre: string; talla: string; color: string; cantidad: number; precioUnitario: number }
type Pedido = { _id: string; items: ItemPedido[]; total: number; estado: string; tipoEntrega: string }
type Pago = { _id: string; metodoPago: string; estadoPago: string; montoPagado: number }

export function ConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { pedido?: Pedido; pago?: Pago } | null

  if (!state?.pedido) return <Navigate to="/catalogo" replace />

  const { pedido, pago } = state

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-primary" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">¡Compra confirmada!</h1>
        <p className="text-muted-foreground mt-2 text-sm font-mono">{pedido._id}</p>

        <Card className="mt-8 border-border p-6 text-left">
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado</span>
              <span className="font-medium">{pedido.estado}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entrega</span>
              <span className="font-medium capitalize">{pedido.tipoEntrega}</span>
            </div>
            {pago && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Método de pago</span>
                <span className="font-medium capitalize">{pago.metodoPago}</span>
              </div>
            )}
          </div>

          <div className="my-4 h-px bg-border" />

          <div className="flex flex-col gap-2 text-sm">
            {pedido.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.nombre} ({item.talla}/{item.color}) x{item.cantidad}
                </span>
                <span>${(item.precioUnitario * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="my-4 h-px bg-border" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary">${pedido.total.toFixed(2)}</span>
          </div>
        </Card>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" className="flex-1 border-border" onClick={() => navigate('/pedidos')}>
            Ver mis pedidos
          </Button>
          <Button className="flex-1" onClick={() => navigate('/catalogo')}>
            Seguir comprando
          </Button>
        </div>
      </div>
    </div>
  )
}