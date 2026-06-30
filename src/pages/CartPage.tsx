import { useCart } from '@/context/CartContext'

export function CartPage() {
  const { items } = useCart()
  return <pre className="p-8">{JSON.stringify(items, null, 2)}</pre>
}