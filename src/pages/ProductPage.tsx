import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Minus, Plus } from 'lucide-react'
import { getProductoById } from '@/api/productosApi'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared'

type Variante = {
  _id: string
  talla: string
  color: string
  stock: number
}

type Producto = {
  _id: string
  nombre: string
  descripcion?: string
  categoria: string
  precio: number
  imagen?: string
  variantes: Variante[]
}

export function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [producto, setProducto] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<Variante | null>(null)
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    if (!id) return
    getProductoById(id)
      .then((data) => setProducto(data.producto))
      .catch(() => setError('No se pudo cargar el producto.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner />

  if (error || !producto) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-destructive">{error || 'Producto no encontrado.'}</p>
      </div>
    )
  }

  const tallasDisponibles = [...new Set(producto.variantes.map((v) => v.talla))]
  const coloresDisponibles = [...new Set(producto.variantes.map((v) => v.color))]

  const seleccionarVariante = (talla: string, color: string) => {
    const variante = producto.variantes.find(
      (v) => v.talla === talla && v.color === color
    )
    setVarianteSeleccionada(variante ?? null)
    setCantidad(1)
  }

  const handleAgregarAlCarrito = () => {
    if (!varianteSeleccionada) {
      toast.error('Selecciona talla y color')
      return
    }
    if (varianteSeleccionada.stock === 0) {
      toast.error('Esta variante está agotada')
      return
    }
    addToCart({
      productoId: producto._id,
      varianteId: varianteSeleccionada._id,
      nombre: producto.nombre,
      imagen: producto.imagen,
      precio: producto.precio,
      talla: varianteSeleccionada.talla,
      color: varianteSeleccionada.color,
      stock: varianteSeleccionada.stock,
      cantidad,
    })
    toast.success('Producto agregado al carrito')
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Imagen */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
            {producto.imagen ? (
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                Sin imagen
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize text-secondary-foreground">
              {producto.categoria}
            </span>

            <h1 className="mt-3 font-serif text-3xl font-semibold text-foreground">
              {producto.nombre}
            </h1>

            <p className="mt-2 text-2xl font-semibold text-primary">
              ${producto.precio.toFixed(2)}
            </p>

            {producto.descripcion && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {producto.descripcion}
              </p>
            )}

            {/* Selector talla */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-foreground">Talla</p>
              <div className="flex flex-wrap gap-2">
                {tallasDisponibles.map((talla) => {
                  const hayStock = producto.variantes.some(
                    (v) => v.talla === talla && v.stock > 0
                  )
                  const seleccionada = varianteSeleccionada?.talla === talla
                  return (
                    <button
                      key={talla}
                      disabled={!hayStock}
                      onClick={() => {
                        if (varianteSeleccionada?.color) {
                          seleccionarVariante(talla, varianteSeleccionada.color)
                        } else {
                          setVarianteSeleccionada(
                            producto.variantes.find(
                              (v) => v.talla === talla && v.stock > 0
                            ) ?? null
                          )
                        }
                      }}
                      className={`min-w-[44px] rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        seleccionada
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:border-primary'
                      } ${!hayStock ? 'cursor-not-allowed opacity-40 line-through' : ''}`}
                    >
                      {talla}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selector color */}
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium text-foreground">Color</p>
              <div className="flex flex-wrap gap-2">
                {coloresDisponibles.map((color) => {
                  const variante = producto.variantes.find(
                    (v) =>
                      v.color === color &&
                      (!varianteSeleccionada?.talla ||
                        v.talla === varianteSeleccionada.talla)
                  )
                  const disponible = variante && variante.stock > 0
                  const seleccionado = varianteSeleccionada?.color === color
                  return (
                    <button
                      key={color}
                      disabled={!variante}
                      onClick={() => {
                        if (varianteSeleccionada?.talla) {
                          seleccionarVariante(varianteSeleccionada.talla, color)
                        } else {
                          setVarianteSeleccionada(
                            producto.variantes.find(
                              (v) => v.color === color && v.stock > 0
                            ) ?? null
                          )
                        }
                      }}
                      className={`rounded-lg border px-3 py-2 text-sm capitalize transition ${
                        seleccionado
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:border-primary'
                      } ${!disponible ? 'cursor-not-allowed opacity-40 line-through' : ''}`}
                    >
                      {color}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Stock info */}
            {varianteSeleccionada && (
              <p className="mt-2 text-xs text-muted-foreground">
                {varianteSeleccionada.stock} unidades disponibles
              </p>
            )}

            {/* Cantidad */}
            <div className="mt-5 flex items-center gap-4">
              <p className="text-sm font-medium text-foreground">Cantidad</p>
              <div className="flex items-center overflow-hidden rounded-lg border border-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none text-primary hover:bg-primary/10"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  disabled={cantidad <= 1}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="w-10 text-center text-sm font-medium">
                  {cantidad}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none text-primary hover:bg-primary/10"
                  onClick={() =>
                    setCantidad((c) =>
                      varianteSeleccionada
                        ? Math.min(c + 1, varianteSeleccionada.stock)
                        : c + 1
                    )
                  }
                  disabled={
                    varianteSeleccionada
                      ? cantidad >= varianteSeleccionada.stock
                      : false
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <Button
              className="mt-8 w-full py-6 text-base"
              onClick={handleAgregarAlCarrito}
              disabled={
                !varianteSeleccionada || varianteSeleccionada.stock === 0
              }
            >
              Agregar al carrito
            </Button>

            {!varianteSeleccionada && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Selecciona talla y color para continuar
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}