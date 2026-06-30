import { useLocation, useNavigate, Navigate } from 'react-router-dom'

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
  estado: string
  tipoEntrega: string
}

type Pago = {
  _id: string
  metodoPago: string
  estadoPago: string
  montoPagado: number
}

export function ConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { pedido?: Pedido; pago?: Pago } | null

  // Si se llega a esta ruta sin haber pasado por checkout, no hay datos en el state
  if (!state?.pedido) {
    return <Navigate to="/catalogo" replace />
  }

  const { pedido, pago } = state

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl text-center">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">✓</span>
      </div>

      <h1 className="text-2xl font-semibold">¡Compra confirmada!</h1>
      <p className="text-muted-foreground mt-1">
        Pedido <span className="font-mono">{pedido._id}</span>
      </p>

      <div className="mt-8 border rounded-lg p-6 text-left">
        <div className="flex justify-between text-sm mb-4">
          <span className="text-muted-foreground">Estado</span>
          <span className="font-medium">{pedido.estado}</span>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <span className="text-muted-foreground">Entrega</span>
          <span className="font-medium capitalize">{pedido.tipoEntrega}</span>
        </div>
        {pago && (
          <div className="flex justify-between text-sm mb-4">
            <span className="text-muted-foreground">Método de pago</span>
            <span className="font-medium capitalize">{pago.metodoPago}</span>
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          {pedido.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.nombre} ({item.talla}/{item.color}) x{item.cantidad}
              </span>
              <span>${(item.precioUnitario * item.cantidad).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span>${pedido.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          onClick={() => navigate('/pedidos')}
          className="flex-1 border rounded-md py-2.5 text-sm hover:bg-muted"
        >
          Ver mis pedidos
        </button>
        <button
          onClick={() => navigate('/catalogo')}
          className="flex-1 bg-primary text-primary-foreground rounded-md py-2.5 text-sm hover:bg-primary/90"
        >
          Seguir comprando
        </button>
      </div>
    </div>
  )
}