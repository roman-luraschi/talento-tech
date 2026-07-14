import { Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import LoadingSpinner from '../components/LoadingSpinner'
import Seo from '../components/Seo'
import { useProducts } from '../context/ProductsContext'
import { useStore } from '../context/StoreContext'
import type { Product } from '../types/store'
import '../css/FavoritesPage.css'

function FavoritesPage() {
  const { favoriteIds } = useStore()
  const { getProductById, loading, error } = useProducts()

  const favoriteProducts: Product[] = favoriteIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined)

  return (
    <div className="favorites-page">
      <Seo
        title="Favoritos | Talento Tech Store"
        description="Los productos que marcaste como favoritos en Talento Tech."
      />
      <div className="favorites-page__container">
        <header className="favorites-page__head">
          <h1 className="favorites-page__title">Favoritos</h1>
          <Link to="/#destacados" className="favorites-page__back">
            Ver productos
          </Link>
        </header>

        {loading ? (
          <LoadingSpinner label="Cargando favoritos..." />
        ) : error ? (
          <p className="favorites-page__empty" role="alert">
            {error}
          </p>
        ) : favoriteProducts.length === 0 ? (
          <p className="favorites-page__empty">
            Todavía no guardaste nada. Tocá la estrella en un producto y aparece
            acá.
          </p>
        ) : (
          <ProductGrid products={favoriteProducts} />
        )}
      </div>
    </div>
  )
}

export default FavoritesPage
