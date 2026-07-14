import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { getProducts } from '../firestore/products/productService'
import type { Product } from '../types/store'

interface ProductsContextValue {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  getProductById: (id: string) => Product | undefined
  getFeaturedProducts: () => Product[]
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadProducts() {
    setLoading(true)
    setError(null)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudieron cargar los productos'
      setError(message)
      setProducts([])
    }
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false

    async function loadInitial() {
      try {
        const data = await getProducts()
        if (cancelled) return
        setProducts(data)
        setError(null)
      } catch (err: unknown) {
        if (cancelled) return
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar los productos'
        setError(message)
        setProducts([])
      }
      if (!cancelled) {
        setLoading(false)
      }
    }

    void loadInitial()
    return () => {
      cancelled = true
    }
  }, [])

  function getProductById(id: string) {
    return products.find((product) => product.id === id)
  }

  function getFeaturedProducts() {
    return products.filter((product) => Boolean(product.badge))
  }

  const value: ProductsContextValue = {
    products,
    loading,
    error,
    refetch: loadProducts,
    getProductById,
    getFeaturedProducts,
  }

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  )
}

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext)
  if (!ctx) {
    throw new Error('useProducts must be used within ProductsProvider')
  }
  return ctx
}
