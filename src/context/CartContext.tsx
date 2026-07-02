import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CartItem = {
  productoId: string
  varianteId: string
  nombre: string
  imagen?: string
  precio: number
  talla: string
  color: string
  stock: number
  cantidad: number
}

type CartContextType = {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productoId: string, varianteId: string) => void
  updateQty: (productoId: string, varianteId: string, cantidad: number) => void
  clearCart: () => void
  cartCount: number
  cartSubtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) =>
          cartItem.productoId === item.productoId &&
          cartItem.varianteId === item.varianteId,
      )

      if (!existingItem) {
        return [...currentItems, item]
      }

      return currentItems.map((cartItem) =>
        cartItem.productoId === item.productoId &&
        cartItem.varianteId === item.varianteId
          ? {
              ...cartItem,
              cantidad: Math.min(cartItem.cantidad + item.cantidad, cartItem.stock),
            }
          : cartItem,
      )
    })
  }

  const removeFromCart = (productoId: string, varianteId: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.productoId !== productoId || item.varianteId !== varianteId,
      ),
    )
  }

  const updateQty = (
    productoId: string,
    varianteId: string,
    cantidad: number,
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productoId === productoId && item.varianteId === varianteId
          ? { ...item, cantidad: Math.max(1, Math.min(cantidad, item.stock)) }
          : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.cantidad, 0),
    [items],
  )

  const cartSubtotal = useMemo(
    () => items.reduce((total, item) => total + item.precio * item.cantidad, 0),
    [items],
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }

  return context
}