import { Flower2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
        <Flower2 className={cn('h-5 w-5 text-primary', iconClassName)} />
      </span>
      <span className="font-serif text-xl font-semibold tracking-tight text-foreground">
        La Belle Robe
      </span>
    </span>
  )
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
    </div>
  )
}

export function formatPrice(value: number) {
  return `$${value.toFixed(2)}`
}

type EstadoPedido = 'Pendiente' | 'Pagado' | 'Enviado' | 'Entregado'

const estadoColores: Record<EstadoPedido, string> = {
  Pendiente: 'bg-yellow-100 text-yellow-800',
  Pagado: 'bg-blue-100 text-blue-800',
  Enviado: 'bg-purple-100 text-purple-800',
  Entregado: 'bg-green-100 text-green-800',
}

export function StatusBadge({ estado }: { estado: EstadoPedido }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-2.5 py-1 text-xs font-medium',
        estadoColores[estado] ?? 'bg-gray-100 text-gray-800',
      )}
    >
      {estado}
    </span>
  )
}