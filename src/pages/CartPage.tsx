import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function CartPage() {
  const navigate = useNavigate()
  const { items, removeFromCart, updateQty, cartSubtotal } = useCart()
  const envio = cartSubtotal > 100 || items.length === 0 ? 0 : 8
  const total = cartSubtotal + envio

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <h1 className="font-serif text-3xl font-semibold text-foreground">Tu carrito</h1>
          <Card className="mt-8 flex flex-col items-center gap-4 border-border py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <p className="text-muted-foreground">Tu carrito está vacío.</p>
            <Button onClick={() => navigate('/catalogo')}>Explorar catálogo</Button>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground">Tu carrito</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Items */}
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <Card
                key={`${item.productoId}-${item.varianteId}`}
                className="flex flex-row items-center gap-4 border-border p-3 sm:p-4"
              >
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {item.imagen && (
                    <img src={item.imagen} alt={item.nombre} className="absolute inset-0 h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="font-medium text-foreground">{item.nombre}</p>
                  <p className="text-xs text-muted-foreground capitalize">Talla {item.talla} · {item.color}</p>
                  <p className="text-sm font-semibold text-primary">${item.precio.toFixed(2)}</p>
                  <div className="mt-1 flex items-center gap-2 rounded-lg border border-border w-fit p-0.5">
                    <Button
                      size="icon" variant="ghost"
                      className="h-7 w-7 text-primary hover:bg-primary/10"
                      onClick={() => updateQty(item.productoId, item.varianteId, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="w-5 text-center text-sm font-medium">{item.cantidad}</span>
                    <Button
                      size="icon" variant="ghost"
                      className="h-7 w-7 text-primary hover:bg-primary/10"
                      onClick={() => updateQty(item.productoId, item.varianteId, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-semibold">${(item.precio * item.cantidad).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.productoId, item.varianteId)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Resumen */}
          <div>
            <Card className="border-border p-6">
              <h2 className="font-serif text-lg font-semibold text-foreground">Resumen</h2>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`}</span>
                </div>
                <div className="my-1 h-px bg-border" />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              <Button className="mt-6 w-full" onClick={() => navigate('/checkout')}>
                Continuar a pagar
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}