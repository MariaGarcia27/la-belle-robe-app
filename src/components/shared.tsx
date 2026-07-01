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