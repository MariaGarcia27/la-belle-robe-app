import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ChevronsUpDown, Pencil, Plus, Trash2, X } from 'lucide-react'
import { AdminLayout } from '@/components/AdminLayout'
import { formatPrice, LoadingSpinner } from '@/components/shared'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DeleteProductDialog } from '@/components/ui/DeleteProductDialog'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from '@/api/productosApi'

type Variante = { talla: string; color: string; stock: number }
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

const CATEGORIAS = ['Vestidos', 'Blusas', 'Faldas', 'Pantalones', 'Accesorios']
const TIPOS_PERMITIDOS = ['image/png', 'image/jpeg']
const TAMANO_MAXIMO_MB = 2
const COLORES_PREDEFINIDOS = [
  'rosa',
  'negro',
  'blanco',
  'azul marino',
  'terracota',
  'rojo',
  'verde',
  'beige',
]

function emptyDraft() {
  return {
    nombre: '',
    descripcion: '',
    categoria: CATEGORIAS[0],
    precio: 0,
    imagen: '',
    variantes: [{ talla: 'M', color: '', stock: 0 }] as Variante[],
  }
}

function compressImage(
  file: File,
  maxDimension = 900,
  quality = 0.75,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const img = new Image()

      img.onload = () => {
        let { width, height } = img

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo procesar la imagen'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }

      img.onerror = () => reject(new Error('No se pudo leer la imagen'))
      img.src = reader.result as string
    }

    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.readAsDataURL(file)
  })
}

function ColorCombobox({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (color: string) => void
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  const coincidencias = COLORES_PREDEFINIDOS.filter((c) =>
    c.toLowerCase().includes(busqueda.trim().toLowerCase()),
  )

  const puedeCrear =
    busqueda.trim().length > 0 &&
    !COLORES_PREDEFINIDOS.some(
      (c) => c.toLowerCase() === busqueda.trim().toLowerCase(),
    )

  function seleccionar(color: string) {
    onChange(color)
    setBusqueda('')
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setBusqueda('')
      }}
    >
      <PopoverTrigger
        className={cn(
          'flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          className,
        )}
      >
        <span
          className={cn('truncate capitalize', !value && 'text-muted-foreground')}
        >
          {value || 'Color'}
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-0">
        <Command>
          <CommandInput
            placeholder="Buscar o escribir color..."
            value={busqueda}
            onValueChange={setBusqueda}
          />
          <CommandList>
            {coincidencias.length === 0 && !puedeCrear && (
              <CommandEmpty>No hay colores que coincidan.</CommandEmpty>
            )}
            <CommandGroup>
              {coincidencias.map((color) => (
                <CommandItem
                  key={color}
                  onSelect={() => seleccionar(color)}
                >
                  {color}
                </CommandItem>
              ))}
            </CommandGroup>
            {puedeCrear && (
              <CommandGroup>
                <CommandItem onSelect={() => seleccionar(busqueda.trim())}>
                  Usar "{busqueda.trim()}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function AdminProductsPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [draft, setDraft] = useState(emptyDraft())
  const [precioInput, setPrecioInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [imagenError, setImagenError] = useState('')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Producto | null>(null)
  const [deleting, setDeleting] = useState(false)

  const cargar = () => {
    setLoading(true)
    getProductos()
      .then((data) => setProductos(data.productos ?? []))
      .catch(() => setError('No se pudieron cargar los productos.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    cargar()
  }, [])

  function openNew() {
    setDraft(emptyDraft())
    setPrecioInput('')
    setIsEdit(false)
    setEditId(null)
    setImagenError('')
    setOpen(true)
  }

  function openEdit(p: Producto) {
    setDraft({
      nombre: p.nombre,
      descripcion: p.descripcion ?? '',
      categoria: p.categoria,
      precio: p.precio,
      imagen: p.imagen ?? '',
      variantes: p.variantes.length
        ? p.variantes.map((v) => ({ talla: v.talla, color: v.color, stock: v.stock }))
        : [{ talla: 'M', color: '', stock: 0 }],
    })
    setPrecioInput(String(p.precio))
    setIsEdit(true)
    setEditId(p._id)
    setImagenError('')
    setOpen(true)
  }

  async function handleImagenChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImagenError('')

    if (!TIPOS_PERMITIDOS.includes(file.type)) {
      setImagenError('Solo se permiten imágenes PNG o JPEG')
      e.target.value = ''
      return
    }

    if (file.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
      setImagenError(`La imagen no puede pesar más de ${TAMANO_MAXIMO_MB}MB`)
      e.target.value = ''
      return
    }

    try {
      const base64 = await compressImage(file)
      setDraft((d) => ({ ...d, imagen: base64 }))
    } catch {
      setImagenError('No se pudo procesar la imagen')
    }
  }

  function removeImagen() {
    setDraft((d) => ({ ...d, imagen: '' }))
    setImagenError('')
  }

  function updateVariante(index: number, field: keyof Variante, value: string | number) {
    setDraft((d) => ({
      ...d,
      variantes: d.variantes.map((v, i) =>
        i === index ? { ...v, [field]: value } : v,
      ),
    }))
  }

  function addVariante() {
    setDraft((d) => ({
      ...d,
      variantes: [...d.variantes, { talla: '', color: '', stock: 0 }],
    }))
  }

  function removeVariante(index: number) {
    setDraft((d) => ({
      ...d,
      variantes: d.variantes.filter((_, i) => i !== index),
    }))
  }

  async function save() {
    if (!draft.nombre.trim()) {
      toast.error('El nombre es obligatorio')
      return
    }
    if (draft.precio <= 0) {
      toast.error('El precio debe ser mayor a 0')
      return
    }
    if (
      draft.variantes.length === 0 ||
      draft.variantes.some((v) => !v.talla.trim() || !v.color.trim())
    ) {
      toast.error('Cada variante necesita talla y color')
      return
    }

    setSaving(true)
    try {
      if (isEdit && editId) {
        await updateProducto(editId, draft)
        toast.success('Producto actualizado')
      } else {
        await createProducto(draft)
        toast.success('Producto agregado')
      }
      setOpen(false)
      cargar()
    } catch {
      toast.error('No se pudo guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
  if (!deleteTarget) return

  setDeleting(true)

  try {
    await deleteProducto(deleteTarget._id)
    toast.success('Producto eliminado')
    setDeleteOpen(false)
    setDeleteTarget(null)
    cargar()
  } catch {
    toast.error('No se pudo eliminar el producto')
  } finally {
    setDeleting(false)
  }
}

  const stockTotal = (p: Producto) =>
    p.variantes.reduce((acc, v) => acc + v.stock, 0)

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <p className="text-destructive">{error}</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Productos
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona el catálogo de la boutique.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-1 h-4 w-4" />
          Agregar nuevo producto
        </Button>
      </header>

      <Card className="overflow-hidden border-border p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary/15 text-left">
              <tr className="text-foreground">
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">
                  Categoría
                </th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">
                  Stock
                </th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    No hay productos registrados todavía.
                  </td>
                </tr>
              ) : (
                productos.map((p) => (
                  <tr key={p._id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                          <img
                            src={p.imagen || '/placeholder.svg'}
                            alt={p.nombre}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-foreground">{p.nombre}</span>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                        {p.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-primary">
                      {formatPrice(p.precio)}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {stockTotal(p)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          onClick={() => openEdit(p)}
                        >
                          <Pencil className="mr-1 h-3.5 w-3.5" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-primary/15 text-primary hover:bg-primary/25"
                          onClick={() => {
                            setDeleteTarget(p)
                            setDeleteOpen(true)
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {isEdit ? 'Editar producto' : 'Nuevo producto'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-nombre">Nombre</Label>
              <Input
                id="p-nombre"
                value={draft.nombre}
                onChange={(e) => setDraft({ ...draft, nombre: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="p-categoria">Categoría</Label>
                <select
                  id="p-categoria"
                  value={draft.categoria}
                  onChange={(e) => setDraft({ ...draft, categoria: e.target.value })}
                  className="h-8 rounded-lg border border-border bg-background px-2.5 text-sm"
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="p-precio">Precio</Label>
                <Input
                  id="p-precio"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={precioInput}
                  onChange={(e) => {
                    const value = e.target.value

                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                      setPrecioInput(value)
                      setDraft({
                        ...draft,
                        precio: value === '' || value === '.' ? 0 : Number(value),
                      })
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-imagen">Imagen del producto</Label>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                  {draft.imagen ? (
                    <img
                      src={draft.imagen}
                      alt="Vista previa"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <Input
                    id="p-imagen"
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleImagenChange}
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      PNG o JPEG, máximo {TAMANO_MAXIMO_MB}MB
                    </p>
                    {draft.imagen && (
                      <button
                        type="button"
                        onClick={removeImagen}
                        className="text-xs font-medium text-destructive hover:underline"
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                  {imagenError && (
                    <p className="text-xs text-destructive">{imagenError}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="p-desc">Descripción</Label>
              <Textarea
                id="p-desc"
                rows={3}
                value={draft.descripcion}
                onChange={(e) =>
                  setDraft({ ...draft, descripcion: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Variantes (talla / color / stock)</Label>
                <Button type="button" size="sm" variant="outline" onClick={addVariante}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Agregar variante
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {draft.variantes.map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      placeholder="Talla"
                      value={v.talla}
                      onChange={(e) => updateVariante(i, 'talla', e.target.value)}
                      className="w-20"
                    />
                    <ColorCombobox
                      value={v.color}
                      onChange={(color) => updateVariante(i, 'color', color)}
                      className="flex-1"
                    />
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Stock"
                      value={v.stock === 0 ? '' : String(v.stock)}
                      onChange={(e) => {
                        const value = e.target.value

                        if (/^\d*$/.test(value)) {
                          updateVariante(
                            i,
                            'stock',
                            value === '' ? 0 : Number(value),
                          )
                        }
                      }}
                      className="w-24"
                    />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => removeVariante(i)}
                      disabled={draft.variantes.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <DeleteProductDialog
        open={deleteOpen}
        productName={deleteTarget?.nombre ?? ''}
        loading={deleting}
        onOpenChange={(nextOpen: boolean) => {
          setDeleteOpen(nextOpen)

          if (!nextOpen && !deleting) {
            setDeleteTarget(null)
          }
        }}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  )
}