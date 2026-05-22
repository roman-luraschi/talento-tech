import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { getCategoryById, getProductById } from '../data/mockStore'
import '../css/ProductDetailPage.css'

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
})

const starPath =
  'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'

function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart, toggleFavorite, isFavorite } = useStore()

  const product = id ? getProductById(id) : undefined

  if (!product) {
    return (
      <div className="product-detail">
        <div className="product-detail__container">
          <header className="product-detail__head">
            <h1 className="product-detail__title">Producto no encontrado</h1>
            <Link to="/" className="product-detail__back">
              Volver al inicio
            </Link>
          </header>
          <p className="product-detail__not-found">
            El producto que buscás no existe o fue removido del catálogo.
          </p>
        </div>
      </div>
    )
  }

  const category = getCategoryById(product.categoryId)
  const esFavorito = isFavorite(product.id)
  const favoritoLabel = esFavorito
    ? `Quitar de favoritos: ${product.name}`
    : `Marcar como favorito: ${product.name}`

  return (
    <div className="product-detail">
      <div className="product-detail__container">
        <header className="product-detail__head">
          <Link to="/" className="product-detail__back">
            ← Volver al inicio
          </Link>
        </header>

        <article className="product-detail__layout">
          <div className="product-detail__media">
            {product.badge ? (
              <span className="product-detail__badge">{product.badge}</span>
            ) : null}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-detail__img"
              width={600}
              height={600}
            />
          </div>

          <div className="product-detail__info">
            {category ? (
              <p className="product-detail__category">{category.label}</p>
            ) : null}
            <h1 className="product-detail__title">{product.name}</h1>
            <p className="product-detail__price">{priceFormatter.format(product.price)}</p>
            {product.description ? (
              <p className="product-detail__description">{product.description}</p>
            ) : null}

            <div className="product-detail__actions">
              <button
                type="button"
                className="product-detail__add"
                onClick={() => addToCart(product)}
              >
                Añadir al carrito
              </button>
              <button
                type="button"
                className={
                  esFavorito
                    ? 'product-detail__favorite product-detail__favorite--active'
                    : 'product-detail__favorite'
                }
                aria-label={favoritoLabel}
                aria-pressed={esFavorito}
                onClick={() => toggleFavorite(product.id)}
              >
                <svg
                  className="product-detail__star"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  aria-hidden
                  focusable="false"
                >
                  <path
                    d={starPath}
                    fill={esFavorito ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default ProductDetailPage
