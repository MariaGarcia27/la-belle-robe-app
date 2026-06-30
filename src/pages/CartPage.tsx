import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'

export function CartPage() {
  const navigate = useNavigate()
  const { items, removeFromCart, updateQty, cartSubtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Tu carrito está vacío.</p>
        <button
          onClick={() => navigate('/catalogo')}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Ir al catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Tu carrito</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productoId}-${item.varianteId}`}
            className="flex items-center gap-4 border rounded-lg p-4"
          >
            <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
              {item.imagen && (
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium">{item.nombre}</p>
              <p className="text-sm text-muted-foreground capitalize">
                Talla {item.talla} · {item.color}
              </p>
              <p className="text-sm mt-1">${item.precio.toFixed(2)}</p>
            </div>

            <div className="flex items-center border rounded-md">
              <button
                onClick={() =>
                  updateQty(item.productoId, item.varianteId, item.cantidad - 1)
                }
                disabled={item.cantidad <= 1}
                className="px-3 py-1 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span className="px-4">{item.cantidad}</span>
              <button
                onClick={() =>
                  updateQty(item.productoId, item.varianteId, item.cantidad + 1)
                }
                disabled={item.cantidad >= item.stock}
                className="px-3 py-1 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            <p className="w-20 text-right font-medium">
              ${(item.precio * item.cantidad).toFixed(2)}
            </p>

            <button
              onClick={() => removeFromCart(item.productoId, item.varianteId)}
              className="text-sm text-destructive hover:underline"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t pt-4">
        <p className="text-lg font-semibold">Subtotal</p>
        <p className="text-lg font-semibold">${cartSubtotal.toFixed(2)}</p>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
      >
        Continuar a pagar
      </button>
    </div>
  )
}