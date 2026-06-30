import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { getProductoById } from '@/api/productosApi'
import { useCart } from '@/context/CartContext'

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
  const { addToCart, cartCount } = useCart()

  const [producto, setProducto] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [varianteSeleccionada, setVarianteSeleccionada] =
    useState<Variante | null>(null)
  const [cantidad, setCantidad] = useState(1)

  useEffect(() => {
    if (!id) return

    const fetchProducto = async () => {
      try {
        setLoading(true)
        const data = await getProductoById(id)
        setProducto(data.producto)
      } catch (err) {
        console.error(err)
        setError('No se pudo cargar el producto.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducto()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Cargando producto...</p>
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-destructive">
          {error || 'Producto no encontrado.'}
        </p>
      </div>
    )
  }

  // Tallas y colores únicos disponibles entre todas las variantes
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Volver
        </button>

        {/* TODO: temporal — quitar cuando exista ClientNavbar (Issue #8) */}
        <Link
          to="/carrito"
          className="text-sm text-primary hover:underline"
        >
          Ver carrito ({cartCount})
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          {producto.imagen && (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{producto.nombre}</h1>
          <p className="text-xl text-muted-foreground mt-1">
            ${producto.precio.toFixed(2)}
          </p>
          {producto.descripcion && (
            <p className="mt-4 text-sm text-muted-foreground">
              {producto.descripcion}
            </p>
          )}

          {/* Selector de talla */}
          <div className="mt-6">
            <p className="text-sm font-medium mb-2">Talla</p>
            <div className="flex flex-wrap gap-2">
              {tallasDisponibles.map((talla) => {
                const haySTockEnTalla = producto.variantes.some(
                  (v) => v.talla === talla && v.stock > 0
                )
                return (
                  <button
                    key={talla}
                    disabled={!haySTockEnTalla}
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
                    className={`px-3 py-1.5 rounded-md border text-sm ${
                      varianteSeleccionada?.talla === talla
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input'
                    } ${
                      !haySTockEnTalla
                        ? 'opacity-40 cursor-not-allowed line-through'
                        : 'hover:border-primary'
                    }`}
                  >
                    {talla}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selector de color */}
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {coloresDisponibles.map((color) => {
                const variante = producto.variantes.find(
                  (v) =>
                    v.color === color &&
                    (!varianteSeleccionada?.talla ||
                      v.talla === varianteSeleccionada.talla)
                )
                const disponible = variante && variante.stock > 0

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
                    className={`px-3 py-1.5 rounded-md border text-sm capitalize ${
                      varianteSeleccionada?.color === color
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input'
                    } ${
                      !disponible
                        ? 'opacity-40 cursor-not-allowed line-through'
                        : 'hover:border-primary'
                    }`}
                  >
                    {color}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Stock disponible de la variante elegida */}
          {varianteSeleccionada && (
            <p className="mt-3 text-xs text-muted-foreground">
              {varianteSeleccionada.stock} unidades disponibles
            </p>
          )}

          {/* Cantidad */}
          <div className="mt-4 flex items-center gap-3">
            <p className="text-sm font-medium">Cantidad</p>
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                className="px-3 py-1 hover:bg-muted"
              >
                −
              </button>
              <span className="px-4">{cantidad}</span>
              <button
                onClick={() =>
                  setCantidad((c) =>
                    varianteSeleccionada
                      ? Math.min(c + 1, varianteSeleccionada.stock)
                      : c + 1
                  )
                }
                className="px-3 py-1 hover:bg-muted"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAgregarAlCarrito}
            disabled={!varianteSeleccionada || varianteSeleccionada.stock === 0}
            className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}