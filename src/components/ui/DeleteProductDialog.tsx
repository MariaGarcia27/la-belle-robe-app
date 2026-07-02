import { AlertTriangle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type DeleteProductDialogProps = {
  open: boolean
  productName: string
  loading?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
}

export function DeleteProductDialog({
  open,
  productName,
  loading = false,
  onOpenChange,
  onConfirm,
}: DeleteProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <DialogTitle>¿Eliminar producto?</DialogTitle>

          <DialogDescription>
            Estás a punto de eliminar permanentemente el producto{' '}
            <span className="font-medium text-foreground">"{productName}"</span>.
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" disabled={loading} />}>
            Cancelar
          </DialogClose>

          <Button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {loading ? 'Eliminando...' : 'Eliminar permanentemente'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}