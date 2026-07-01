import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Truck, Store, CreditCard, Banknote, ArrowLeft } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { createPedido } from '@/api/pedidosApi'
import { createPago } from '@/api/pagosApi'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type TipoEntrega = 'domicilio' | 'tienda'
type MetodoPago = 'tarjeta' | 'efectivo'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, cartSubtotal, clearCart } = useCart()

  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>('domicilio')
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('tarjeta')
  const [ultimosDigitos, setUltimosDigitos] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <p className="text-muted-foreground">No tienes productos en el carrito.</p>
        <Button variant="outline" onClick={() => navigate('/catalogo')}>
          Ir al catálogo
        </Button>
      </div>
    )
  }

  const validar = () => {
    const e: Record<string, string> = {}
    if (metodoPago === 'tarjeta' && !/^\d{4}$/.test(ultimosDigitos)) {
      e.ultimosDigitos = 'Ingresa los últimos 4 dígitos de la tarjeta.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validar()) return
    setSubmitting(true)

    try {
      const pedidoData = await createPedido({
        items: items.map((item) => ({
          productoId: item.productoId,
          talla: item.talla,
          color: item.color,
          cantidad: item.cantidad,
        })),
        tipoEntrega,
      })

      const pedido = pedidoData.pedido

      const pagoData = await createPago({
        pedidoId: pedido._id,
        metodoPago,
        montoPagado: pedido.total,
        estadoPago: 'completado',
        ...(metodoPago === 'tarjeta'
          ? { datosTarjeta: { ultimosDigitos } }
          : {}),
      })

      clearCart()
      toast.success('¡Compra finalizada con éxito!')
      navigate('/confirmacion', {
        state: { pedido, pago: pagoData.pago },
      })
    } catch (err: any) {
      const mensaje =
        err?.response?.data?.mensaje ||
        'No se pudo completar la compra. Intenta de nuevo.'
      toast.error(mensaje)
      setErrors({ submit: mensaje })
    } finally {
      setSubmitting(false)
    }
  }

  const envio = cartSubtotal > 100 ? 0 : 8
  const total = cartSubtotal + envio

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate('/carrito')}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al carrito
        </button>

        <h1 className="mb-8 font-serif text-3xl font-semibold text-foreground">
          Finalizar compra
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            {/* Formulario */}
            <div className="flex flex-col gap-6">

              {/* Tipo de entrega */}
              <Card className="border-border p-5">
                <p className="mb-3 font-medium text-foreground">
                  Tipo de entrega
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { value: 'domicilio', label: 'A domicilio', icon: Truck },
                      { value: 'tienda', label: 'Recoger en tienda', icon: Store },
                    ] as const
                  ).map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTipoEntrega(value)}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-medium transition ${
                        tipoEntrega === value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-background text-foreground hover:border-primary/50'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Método de pago */}
              <Card className="border-border p-5">
                <p className="mb-3 font-medium text-foreground">
                  Método de pago
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { value: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
                      { value: 'efectivo', label: 'Efectivo', icon: Banknote },
                    ] as const
                  ).map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMetodoPago(value)}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-medium transition ${
                        metodoPago === value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-background text-foreground hover:border-primary/50'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Campo tarjeta */}
                {metodoPago === 'tarjeta' && (
                  <div className="mt-4">
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Últimos 4 dígitos de la tarjeta
                    </label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="0000"
                      value={ultimosDigitos}
                      onChange={(e) =>
                        setUltimosDigitos(e.target.value.replace(/\D/g, ''))
                      }
                      className={errors.ultimosDigitos ? 'border-destructive' : ''}
                    />
                    {errors.ultimosDigitos && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.ultimosDigitos}
                      </p>
                    )}
                  </div>
                )}
              </Card>

              {errors.submit && (
                <p className="text-sm text-destructive">{errors.submit}</p>
              )}
            </div>

            {/* Resumen del pedido */}
            <div>
              <Card className="border-border p-6">
                <h2 className="mb-4 font-serif text-lg font-semibold text-foreground">
                  Resumen
                </h2>

                <div className="flex flex-col gap-2 text-sm">
                  {items.map((item) => (
                    <div
                      key={`${item.productoId}-${item.varianteId}`}
                      className="flex justify-between"
                    >
                      <span className="text-muted-foreground">
                        {item.nombre} ({item.talla}/{item.color}) x{item.cantidad}
                      </span>
                      <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="my-4 h-px bg-border" />

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span>
                      {envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="my-4 h-px bg-border" />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                <Button
                  type="submit"
                  className="mt-6 w-full py-6 text-base"
                  disabled={submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? 'Procesando...' : 'Confirmar y pagar'}
                </Button>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Al confirmar aceptas los términos de compra
                </p>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}