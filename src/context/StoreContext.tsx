import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import { findCuponByCodigo } from '../firestore/cupones/cuponService'
import {
  getUserProfile,
  saveUserCart,
  saveUserFavorites,
} from '../firestore/users/userService'
import type { AppliedCoupon } from '../types/cupon'
import type { CartLine, Product } from '../types/store'

const STORAGE_CART_GUEST = 'talento-tech-cart-guest:v1'
const STORAGE_CART_GUEST_LEGACY = 'talento-tech-cart-guest'
const STORAGE_FAVORITES_GUEST = 'talento-tech-favorites-guest:v1'
const STORAGE_FAVORITES_GUEST_LEGACY = 'talento-tech-favorites-guest'
const STORAGE_COUPON = 'talento-tech-coupon:v1'
const STORAGE_COUPON_LEGACY = 'talento-tech-coupon'

function readStorageWithMigration(
  currentKey: string,
  legacyKey: string,
): string | null {
  try {
    const current = localStorage.getItem(currentKey)
    if (current !== null) return current

    const legacy = localStorage.getItem(legacyKey)
    if (legacy === null) return null

    localStorage.setItem(currentKey, legacy)
    localStorage.removeItem(legacyKey)
    return legacy
  } catch {
    return null
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

function loadGuestCart(): CartLine[] {
  try {
    const raw = readStorageWithMigration(
      STORAGE_CART_GUEST,
      STORAGE_CART_GUEST_LEGACY,
    )
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidCartLine)
  } catch {
    return []
  }
}

function loadGuestFavorites(): string[] {
  try {
    const raw = readStorageWithMigration(
      STORAGE_FAVORITES_GUEST,
      STORAGE_FAVORITES_GUEST_LEGACY,
    )
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x): x is string => typeof x === 'string')
  } catch {
    return []
  }
}

function persistGuestCart(lines: CartLine[]) {
  try {
    localStorage.setItem(STORAGE_CART_GUEST, JSON.stringify(lines))
    localStorage.removeItem(STORAGE_CART_GUEST_LEGACY)
  } catch {
    void 0
  }
}

function persistGuestFavorites(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_FAVORITES_GUEST, JSON.stringify(ids))
    localStorage.removeItem(STORAGE_FAVORITES_GUEST_LEGACY)
  } catch {
    void 0
  }
}

function loadAppliedCoupon(): AppliedCoupon | null {
  try {
    const raw = readStorageWithMigration(STORAGE_COUPON, STORAGE_COUPON_LEGACY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (parsed === null || typeof parsed !== 'object') return null
    const o = parsed as Record<string, unknown>
    if (
      typeof o.id !== 'string' ||
      typeof o.codigo !== 'string' ||
      typeof o.descuento !== 'number' ||
      !Number.isFinite(o.descuento) ||
      o.descuento < 1 ||
      o.descuento > 100
    ) {
      return null
    }
    return { id: o.id, codigo: o.codigo, descuento: o.descuento }
  } catch {
    return null
  }
}

function persistAppliedCoupon(coupon: AppliedCoupon | null) {
  try {
    if (!coupon) {
      localStorage.removeItem(STORAGE_COUPON)
      localStorage.removeItem(STORAGE_COUPON_LEGACY)
      return
    }
    localStorage.setItem(STORAGE_COUPON, JSON.stringify(coupon))
    localStorage.removeItem(STORAGE_COUPON_LEGACY)
  } catch {
    void 0
  }
}

interface StoreContextValue {
  cart: CartLine[]
  favoriteIds: string[]
  storeReady: boolean
  appliedCoupon: AppliedCoupon | null
  addToCart: (product: Product) => void
  setLineQuantity: (productId: string, quantity: number) => void
  removeLine: (productId: string) => void
  clearCart: () => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  applyCoupon: (codigo: string) => Promise<void>
  clearCoupon: () => void
  totalItemCount: number
  cartSubtotal: number
  discountAmount: number
  cartTotal: number
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const uid = user?.uid ?? null

  const [cart, setCart] = useState<CartLine[]>([])
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    loadAppliedCoupon,
  )
  const [storeReady, setStoreReady] = useState(false)
  const skipCartPersist = useRef(true)
  const skipFavoritesPersist = useRef(true)

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      if (authLoading) return

      setStoreReady(false)
      skipCartPersist.current = true
      skipFavoritesPersist.current = true

      try {
        if (!uid) {
          if (!cancelled) {
            const guestCart = loadGuestCart()
            setCart(guestCart)
            setFavoriteIds(loadGuestFavorites())
            if (guestCart.length === 0) {
              setAppliedCoupon(null)
            }
          }
        } else {
          const profile = await getUserProfile(uid)
          if (!cancelled) {
            const nextCart = profile?.cart ?? []
            setCart(nextCart)
            setFavoriteIds(profile?.favoriteIds ?? [])
            if (nextCart.length === 0) {
              setAppliedCoupon(null)
            }
          }
        }
      } catch {
        if (!cancelled) {
          setCart([])
          setFavoriteIds([])
          setAppliedCoupon(null)
        }
      }
      if (!cancelled) {
        setStoreReady(true)
      }
    }

    void hydrate()
    return () => {
      cancelled = true
    }
  }, [uid, authLoading])

  useEffect(() => {
    if (!storeReady) return
    if (skipCartPersist.current) {
      skipCartPersist.current = false
      return
    }

    if (!uid) {
      persistGuestCart(cart)
      return
    }

    void saveUserCart(uid, cart).catch(() => {
      void 0
    })
  }, [cart, uid, storeReady])

  useEffect(() => {
    if (!storeReady) return
    if (skipFavoritesPersist.current) {
      skipFavoritesPersist.current = false
      return
    }

    if (!uid) {
      persistGuestFavorites(favoriteIds)
      return
    }

    void saveUserFavorites(uid, favoriteIds).catch(() => {
      void 0
    })
  }, [favoriteIds, uid, storeReady])

  useEffect(() => {
    persistAppliedCoupon(appliedCoupon)
  }, [appliedCoupon])

  function addToCart(product: Product) {
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
  }

  function setLineQuantity(productId: string, quantity: number) {
    const next =
      quantity < 1
        ? cart.filter((l) => l.productId !== productId)
        : cart.map((l) =>
            l.productId === productId ? { ...l, quantity } : l,
          )
    setCart(next)
    if (next.length === 0) {
      setAppliedCoupon(null)
    }
  }

  function removeLine(productId: string) {
    const next = cart.filter((l) => l.productId !== productId)
    setCart(next)
    if (next.length === 0) {
      setAppliedCoupon(null)
    }
  }

  function clearCart() {
    setCart([])
    setAppliedCoupon(null)
  }

  function toggleFavorite(productId: string) {
    setFavoriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    )
  }

  function isFavorite(productId: string) {
    return favoriteIds.includes(productId)
  }

  async function applyCoupon(codigo: string) {
    const trimmed = codigo.trim()
    if (!trimmed) {
      throw new Error('Ingresá un código de cupón.')
    }

    const cupon = await findCuponByCodigo(trimmed)
    if (!cupon) {
      throw new Error('El cupón no es válido o no existe.')
    }

    setAppliedCoupon({
      id: cupon.id,
      codigo: cupon.codigo,
      descuento: cupon.descuento,
    })
  }

  function clearCoupon() {
    setAppliedCoupon(null)
  }

  const totalItemCount = cart.reduce((sum, l) => sum + l.quantity, 0)
  const cartSubtotal = cart.reduce((sum, l) => sum + l.price * l.quantity, 0)
  const discountAmount =
    !appliedCoupon || cartSubtotal <= 0
      ? 0
      : (cartSubtotal * appliedCoupon.descuento) / 100
  const cartTotal = Math.max(0, cartSubtotal - discountAmount)

  const value: StoreContextValue = {
    cart,
    favoriteIds,
    storeReady,
    appliedCoupon,
    addToCart,
    setLineQuantity,
    removeLine,
    clearCart,
    toggleFavorite,
    isFavorite,
    applyCoupon,
    clearCoupon,
    totalItemCount,
    cartSubtotal,
    discountAmount,
    cartTotal,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return ctx
}
