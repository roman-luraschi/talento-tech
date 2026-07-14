import { useLayoutEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Seo from '../components/Seo'
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
  const {
    cart,
    setLineQuantity,
    removeLine,
    clearCart,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    clearCoupon,
    discountAmount,
    cartTotal,
  } = useStore()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  useLayoutEffect(() => {
    if (!location.hash) return
    navigate(
      { pathname: location.pathname, search: location.search },
      { replace: true },
    )
    window.scrollTo(0, 0)
  }, [location.hash, location.pathname, location.search, navigate])

  async function handleApplyCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCouponError(null)
    setIsApplyingCoupon(true)
    try {
      await applyCoupon(couponInput)
      setCouponInput('')
      toast.success('Cupón aplicado correctamente')
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'No se pudo aplicar el cupón.'
      setCouponError(message)
      toast.error(message)
    }
    setIsApplyingCoupon(false)
  }

  function handleClearCoupon() {
    clearCoupon()
    setCouponError(null)
    toast.info('Cupón quitado del carrito')
  }

  function handleClearCart() {
    clearCart()
    setCouponError(null)
    toast.info('Carrito vaciado')
  }

  return (
    <div className="cart-page">
      <Seo
        title="Carrito | Talento Tech Store"
        description="Tu carrito en Talento Tech. Revisá cantidades y cerrá la compra."
      />
      <div className="cart-page__container">
        <header className="cart-page__head">
          <h1 className="cart-page__title">Carrito</h1>
          <Link to="/" className="cart-page__back">
            Seguir comprando
          </Link>
        </header>

        {cart.length === 0 ? (
          <p className="cart-page__empty">
            Todavía no agregaste nada. Mirá el catálogo y sumá lo que quieras.
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

            <section
              className="cart-coupon"
              aria-labelledby="cart-coupon-title"
            >
              <h2 id="cart-coupon-title" className="cart-coupon__title">
                Cupón de descuento
              </h2>

              {appliedCoupon ? (
                <div className="cart-coupon__applied">
                  <div className="cart-coupon__applied-info">
                    <span className="cart-coupon__code">
                      {appliedCoupon.codigo}
                    </span>
                    <span className="cart-coupon__percent">
                      {appliedCoupon.descuento}% de descuento
                    </span>
                  </div>
                  <button
                    type="button"
                    className="cart-coupon__clear"
                    onClick={handleClearCoupon}
                  >
                    Quitar cupón
                  </button>
                </div>
              ) : (
                <form
                  className="cart-coupon__form"
                  onSubmit={handleApplyCoupon}
                  noValidate
                >
                  <label className="cart-coupon__field">
                    <span className="visually-hidden">Código del cupón</span>
                    <input
                      className="cart-coupon__input"
                      type="text"
                      name="codigo"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value)
                        if (couponError) setCouponError(null)
                      }}
                      placeholder="Ej: VERANO20"
                      autoComplete="off"
                      disabled={isApplyingCoupon}
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    className="cart-coupon__submit"
                    disabled={isApplyingCoupon || !couponInput.trim()}
                  >
                    {isApplyingCoupon ? 'Validando…' : 'Aplicar'}
                  </button>
                </form>
              )}

              {couponError ? (
                <p className="cart-coupon__error" role="alert">
                  {couponError}
                </p>
              ) : null}
            </section>

            <footer className="cart-page__footer">
              <div className="cart-page__summary">
                <p className="cart-page__row">
                  <span>Subtotal</span>
                  <span>{priceFormatter.format(cartSubtotal)}</span>
                </p>
                {appliedCoupon ? (
                  <p className="cart-page__row cart-page__row--discount">
                    <span>Descuento ({appliedCoupon.descuento}%)</span>
                    <span>−{priceFormatter.format(discountAmount)}</span>
                  </p>
                ) : null}
                <p className="cart-page__total">
                  <span className="cart-page__total-label">Total</span>
                  <span className="cart-page__total-value">
                    {priceFormatter.format(cartTotal)}
                  </span>
                </p>
              </div>
              <button
                type="button"
                className="cart-page__clear"
                onClick={handleClearCart}
              >
                Vaciar carrito
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage
