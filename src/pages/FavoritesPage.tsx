import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { getProductById } from '../data/mockStore'
import { useStore } from '../context/StoreContext'
import type { Product } from '../types/store'
import '../css/FavoritesPage.css'

function FavoritesPage() {
  const { favoriteIds } = useStore()

  const favoriteProducts = useMemo((): Product[] => {
    return favoriteIds
      .map((id) => getProductById(id))
      .filter((p): p is Product => p !== undefined)
  }, [favoriteIds])

  return (
    <div className="favorites-page">
      <div className="favorites-page__container">
        <header className="favorites-page__head">
          <h1 className="favorites-page__title">Favoritos</h1>
          <Link to="/#destacados" className="favorites-page__back">
            Ver destacados
          </Link>
        </header>

        {favoriteProducts.length === 0 ? (
          <p className="favorites-page__empty">
            No tenés favoritos todavía. Marcá la estrella en un producto para
            guardarlo acá.
          </p>
        ) : (
          <ProductGrid products={favoriteProducts} />
        )}
      </div>
    </div>
  )
}

export default FavoritesPage
