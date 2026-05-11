import { useLayoutEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import '../css/CartPage.css'

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
})

function CartPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cart, setLineQuantity, removeLine, cartSubtotal } = useStore()

  useLayoutEffect(() => {
    if (!location.hash) return
    navigate(
      { pathname: location.pathname, search: location.search },
      { replace: true },
    )
    window.scrollTo(0, 0)
  }, [location.hash, location.pathname, location.search, navigate])

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        <header className="cart-page__head">
          <h1 className="cart-page__title">Carrito</h1>
          <Link to="/" className="cart-page__back">
            Seguir comprando
          </Link>
        </header>

        {cart.length === 0 ? (
          <p className="cart-page__empty">
            Tu carrito está vacío. Explorá el catálogo para agregar productos.
          </p>
        ) : (
          <>
            <ul className="cart-page__lines" aria-label="Productos en el carrito">
              {cart.map((line) => (
                <li key={line.productId} className="cart-line">
                  <img
                    src={line.imageUrl}
                    alt=""
                    className="cart-line__img"
                    width={88}
                    height={88}
                  />
                  <div className="cart-line__body">
                    <h2 className="cart-line__name">{line.name}</h2>
                    <p className="cart-line__unit">
                      {priceFormatter.format(line.price)} c/u
                    </p>
                    <div className="cart-line__controls">
                      <div className="cart-line__qty">
                        <button
                          type="button"
                          className="cart-line__qty-btn"
                          aria-label={`Reducir cantidad de ${line.name}`}
                          onClick={() =>
                            setLineQuantity(line.productId, line.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="cart-line__qty-value" aria-live="polite">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className="cart-line__qty-btn"
                          aria-label={`Aumentar cantidad de ${line.name}`}
                          onClick={() =>
                            setLineQuantity(line.productId, line.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="cart-line__remove"
                        onClick={() => removeLine(line.productId)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                  <p className="cart-line__subtotal">
                    {priceFormatter.format(line.price * line.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <footer className="cart-page__footer">
              <p className="cart-page__total">
                <span className="cart-page__total-label">Total</span>
                <span className="cart-page__total-value">
                  {priceFormatter.format(cartSubtotal)}
                </span>
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage
