import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartLine, Product } from '../types/store'

const STORAGE_CART = 'talento-tech-cart'
const STORAGE_FAVORITES = 'talento-tech-favorites'

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_CART)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidCartLine)
  } catch {
    return []
  }
}

function isValidCartLine(item: unknown): item is CartLine {
  if (item === null || typeof item !== 'object') return false
  const o = item as Record<string, unknown>
  return (
    typeof o.productId === 'string' &&
    typeof o.quantity === 'number' &&
    o.quantity > 0 &&
    typeof o.name === 'string' &&
    typeof o.price === 'number' &&
    typeof o.imageUrl === 'string'
  )
}

function loadFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_FAVORITES)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is string => typeof x === 'string')
  } catch {
    return []
  }
}

function persistCart(lines: CartLine[]) {
  try {
    localStorage.setItem(STORAGE_CART, JSON.stringify(lines))
  } catch {
    void 0
  }
}

function persistFavorites(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(ids))
  } catch {
    void 0
  }
}

interface StoreContextValue {
  cart: CartLine[]
  favoriteIds: string[]
  addToCart: (product: Product) => void
  setLineQuantity: (productId: string, quantity: number) => void
  removeLine: (productId: string) => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  totalItemCount: number
  cartSubtotal: number
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(loadCart)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(loadFavoriteIds)

  useEffect(() => {
    persistCart(cart)
  }, [cart])

  useEffect(() => {
    persistFavorites(favoriteIds)
  }, [favoriteIds])

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((l) => l.productId === product.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 }
        return next
      }
      return [
        ...prev,
        {
          productId: product.id,
          quantity: 1,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
        },
      ]
    })
  }, [])

  const setLineQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setCart((prev) => prev.filter((l) => l.productId !== productId))
      return
    }
    setCart((prev) =>
      prev.map((l) =>
        l.productId === productId ? { ...l, quantity } : l,
      ),
    )
  }, [])

  const removeLine = useCallback((productId: string) => {
    setCart((prev) => prev.filter((l) => l.productId !== productId))
  }, [])

  const toggleFavorite = useCallback((productId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    )
  }, [])

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.includes(productId),
    [favoriteIds],
  )

  const totalItemCount = useMemo(
    () => cart.reduce((sum, l) => sum + l.quantity, 0),
    [cart],
  )

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [cart],
  )

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      favoriteIds,
      addToCart,
      setLineQuantity,
      removeLine,
      toggleFavorite,
      isFavorite,
      totalItemCount,
      cartSubtotal,
    }),
    [
      cart,
      favoriteIds,
      addToCart,
      setLineQuantity,
      removeLine,
      toggleFavorite,
      isFavorite,
      totalItemCount,
      cartSubtotal,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return ctx
}
