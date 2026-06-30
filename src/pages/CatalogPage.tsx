import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProductos } from '@/api/productosApi'

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
  activo: boolean
  variantes: Variante[]
}

export function CatalogPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoria, setCategoria] = useState<string>('todas')

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true)
        const data = await getProductos()
        setProductos(data.productos)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar los productos. Intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    fetchProductos()
  }, [])

  const categorias = ['todas', ...new Set(productos.map((p) => p.categoria))]

  const productosFiltrados =
    categoria === 'todas'
      ? productos
      : productos.filter((p) => p.categoria === categoria)

  // Suma el stock de todas las variantes para saber si hay algo disponible
  const stockTotal = (producto: Producto) =>
    producto.variantes.reduce((acc, v) => acc + v.stock, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Catálogo de productos</h1>

      {/* Filtro por categoría */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${
              categoria === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {productosFiltrados.map((producto) => (
            <Link
              key={producto._id}
              to={`/producto/${producto._id}`}
              className="group rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-muted overflow-hidden">
                {producto.imagen && (
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">
                  {producto.nombre}
                </h3>
                <p className="text-sm text-muted-foreground">
                  ${producto.precio.toFixed(2)}
                </p>
                {stockTotal(producto) === 0 && (
                  <span className="text-xs text-destructive">Agotado</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}