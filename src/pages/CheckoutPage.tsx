import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useCart } from '@/context/CartContext'
import { createPedido } from '@/api/pedidosApi'
import { createPago } from '@/api/pagosApi'

type TipoEntrega = 'domicilio' | 'tienda'
type MetodoPago = 'tarjeta' | 'transferencia' | 'efectivo'

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
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">
          No tienes productos en el carrito.
        </p>
        <button
          onClick={() => navigate('/catalogo')}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Ir al catálogo
        </button>
      </div>
    )
  }

  const validar = () => {
    const nuevosErrores: Record<string, string> = {}

    if (!tipoEntrega) {
      nuevosErrores.tipoEntrega = 'Selecciona un tipo de entrega.'
    }

    if (!metodoPago) {
      nuevosErrores.metodoPago = 'Selecciona un método de pago.'
    }

    if (metodoPago === 'tarjeta' && !/^\d{4}$/.test(ultimosDigitos)) {
      nuevosErrores.ultimosDigitos =
        'Ingresa los últimos 4 dígitos de la tarjeta.'
    }

    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validar()) return

    setSubmitting(true)

    try {
      // 1. Crear el pedido con los items del carrito
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

      // 2. Registrar el pago asociado a ese pedido
      const pagoData = await createPago({
        pedidoId: pedido._id,
        metodoPago,
        montoPagado: pedido.total,
        estadoPago: 'completado',
        ...(metodoPago === 'tarjeta' ? { datosTarjeta: { ultimosDigitos } } : {}),
      })

      clearCart()
      toast.success('Compra finalizada con éxito')

      navigate('/confirmacion', {
        state: { pedido, pago: pagoData.pago },
      })
    } catch (err: any) {
      console.error(err)
      const mensaje =
        err?.response?.data?.mensaje ||
        'No se pudo completar la compra. Intenta de nuevo.'
      toast.error(mensaje)
      setErrors({ submit: mensaje })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">Finalizar compra</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de entrega */}
        <div>
          <p className="text-sm font-medium mb-2">Tipo de entrega</p>
          <div className="flex gap-3">
            {(['domicilio', 'tienda'] as TipoEntrega[]).map((opcion) => (
              <button
                key={opcion}
                type="button"
                onClick={() => setTipoEntrega(opcion)}
                className={`flex-1 px-4 py-2 rounded-md border text-sm capitalize ${
                  tipoEntrega === opcion
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input hover:border-primary'
                }`}
              >
                {opcion === 'domicilio' ? 'A domicilio' : 'Recoger en tienda'}
              </button>
            ))}
          </div>
          {errors.tipoEntrega && (
            <p className="text-xs text-destructive mt-1">{errors.tipoEntrega}</p>
          )}
        </div>

        {/* Método de pago */}
        <div>
          <p className="text-sm font-medium mb-2">Método de pago</p>
          <div className="flex gap-3">
            {(['tarjeta', 'transferencia', 'efectivo'] as MetodoPago[]).map(
              (opcion) => (
                <button
                  key={opcion}
                  type="button"
                  onClick={() => setMetodoPago(opcion)}
                  className={`flex-1 px-4 py-2 rounded-md border text-sm capitalize ${
                    metodoPago === opcion
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input hover:border-primary'
                  }`}
                >
                  {opcion}
                </button>
              ),
            )}
          </div>
          {errors.metodoPago && (
            <p className="text-xs text-destructive mt-1">{errors.metodoPago}</p>
          )}
        </div>

        {/* Últimos 4 dígitos si es tarjeta */}
        {metodoPago === 'tarjeta' && (
          <div>
            <label className="text-sm font-medium mb-2 block">
              Últimos 4 dígitos de la tarjeta
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={ultimosDigitos}
              onChange={(e) =>
                setUltimosDigitos(e.target.value.replace(/\D/g, ''))
              }
              placeholder="0000"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            {errors.ultimosDigitos && (
              <p className="text-xs text-destructive mt-1">
                {errors.ultimosDigitos}
              </p>
            )}
          </div>
        )}

        {/* Resumen */}
        <div className="border-t pt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {items.length} producto(s)
          </p>
          <p className="text-lg font-semibold">${cartSubtotal.toFixed(2)}</p>
        </div>

        {errors.submit && (
          <p className="text-sm text-destructive">{errors.submit}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          {submitting ? 'Procesando...' : 'Confirmar y pagar'}
        </button>
      </form>
    </div>
  )
}