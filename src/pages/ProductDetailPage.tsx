import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaShoppingCart, FaStar } from 'react-icons/fa'
import Seo from '../components/Seo'
import { useStore } from '../context/StoreContext'
import { useProducts } from '../context/ProductsContext'
import { getCategoryById } from '../data/mockStore'
import { BotonCompra, BotonFavorito } from '../styles/buttons'
import '../css/ProductDetailPage.css'

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
})

function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const { getProductById, loading, error } = useProducts()

  const product = id ? getProductById(id) : undefined

  if (loading) {
    return (
      <div className="product-detail">
        <div className="product-detail__container">
          <p className="product-detail__not-found">Cargando producto…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="product-detail">
        <div className="product-detail__container">
          <header className="product-detail__head">
            <h1 className="product-detail__title">Error al cargar</h1>
            <Link to="/" className="product-detail__back">
              Volver al inicio
            </Link>
          </header>
          <p className="product-detail__not-found">{error}</p>
        </div>
      </div>
    )
  }

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

  const item = product
  const category = getCategoryById(item.categoryId)
  const esFavorito = isFavorite(item.id)
  const favoritoLabel = esFavorito
    ? `Quitar de favoritos: ${item.name}`
    : `Marcar como favorito: ${item.name}`

  function handleAddToCart() {
    addToCart(item)
    toast.success(`${item.name} agregado al carrito`)
  }

  function handleToggleFavorite() {
    const estabaEnFavoritos = isFavorite(item.id)
    toggleFavorite(item.id)
    if (estabaEnFavoritos) {
      toast.info(`${item.name} quitado de favoritos`)
    } else {
      toast.success(`${item.name} agregado a favoritos`)
    }
  }

  return (
    <div className="product-detail">
      <Seo
        title={`${item.name} | Talento Tech Store`}
        description={
          item.description ?? `${item.name} en Talento Tech.`
        }
      />
      <div className="product-detail__container">
        <header className="product-detail__head">
          <Link to="/" className="product-detail__back">
            ← Volver al inicio
          </Link>
        </header>

        <article className="product-detail__layout">
          <div className="product-detail__media">
            {item.badge ? (
              <span className="product-detail__badge">{item.badge}</span>
            ) : null}
            <img
              src={item.imageUrl}
              alt={item.name}
              className="product-detail__img img-fluid"
              width={600}
              height={600}
            />
          </div>

          <div className="product-detail__info">
            {category ? (
              <p className="product-detail__category">{category.label}</p>
            ) : null}
            <h1 className="product-detail__title">{item.name}</h1>
            <p className="product-detail__price">
              {priceFormatter.format(item.price)}
            </p>
            {item.description ? (
              <p className="product-detail__description">{item.description}</p>
            ) : null}

            <div className="product-detail__actions">
              <BotonCompra type="button" onClick={handleAddToCart}>
                <FaShoppingCart aria-hidden />
                Añadir al carrito
              </BotonCompra>
              <BotonFavorito
                type="button"
                $activo={esFavorito}
                aria-label={favoritoLabel}
                aria-pressed={esFavorito}
                onClick={handleToggleFavorite}
              >
                <FaStar aria-hidden />
              </BotonFavorito>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default ProductDetailPage
