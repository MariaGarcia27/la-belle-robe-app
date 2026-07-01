import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ShoppingBag } from 'lucide-react'
import { getProductos } from '@/api/productosApi'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/shared'

type Variante = { _id: string; talla: string; color: string; stock: number }
type Producto = {
  _id: string; nombre: string; descripcion?: string
  categoria: string; precio: number; imagen?: string
  activo: boolean; variantes: Variante[]
}

export function CatalogPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [query, setQuery] = useState('')

  useEffect(() => {
    getProductos()
      .then((data) => setProductos(data.productos))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false))
  }, [])

  const categorias = ['todas', ...new Set(productos.map((p) => p.categoria))]

  const filtrados = useMemo(() => {
    return productos.filter((p) => {
      const matchCat = categoria === 'todas' || p.categoria === categoria
      const matchQ = p.nombre.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQ
    })
  }, [productos, categoria, query])

  const stockTotal = (p: Producto) => p.variantes.reduce((a, v) => a + v.stock, 0)

  if (loading) return <LoadingSpinner />
  if (error) return <div className="flex justify-center py-20"><p className="text-destructive">{error}</p></div>

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-linear-to-r from-primary/85 via-primary/60 to-secondary">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center sm:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/90">Colección Primavera</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold text-white sm:text-5xl">La Belle Robe</h1>
          <p className="mt-3 text-lg text-white/90">Viste lo que sientes</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Filtros */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition ${
                  categoria === cat
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-primary/40 bg-secondary text-foreground hover:bg-secondary/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              placeholder="Buscar prendas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 sm:w-56"
            />
          </div>
        </div>

        {/* Grid */}
        {filtrados.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <ShoppingBag className="h-12 w-12 text-primary/40" />
            <p className="text-muted-foreground">No hay productos en esta categoría.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filtrados.map((producto) => (
              <Link key={producto._id} to={`/producto/${producto._id}`}>
                <Card className="group overflow-hidden border-border p-0 shadow-sm transition hover:shadow-md">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">Sin imagen</div>
                    )}
                    {stockTotal(producto) === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-destructive/90 px-2 py-0.5 text-[10px] font-medium text-white">Agotado</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 p-4">
                    <span className="w-fit rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium capitalize text-secondary-foreground">
                      {producto.categoria}
                    </span>
                    <p className="font-medium leading-snug text-foreground group-hover:text-primary transition-colors">
                      {producto.nombre}
                    </p>
                    <p className="text-lg font-semibold text-primary">${producto.precio.toFixed(2)}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}