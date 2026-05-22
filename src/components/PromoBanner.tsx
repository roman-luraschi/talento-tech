import '../css/PromoBanner.css'

function PromoBanner() {
  return (
    <aside id="ofertas" className="promo-banner" aria-labelledby="promo-heading">
      <div className="promo-banner__inner">
        <div className="promo-banner__content">
          <h2 id="promo-heading" className="promo-banner__title">
            Ofertas de la semana
          </h2>
          <p className="promo-banner__text">
            Envío gratis en compras superiores a $100. Cambios y devoluciones
            dentro de los primeros 30 días.
          </p>
        </div>
        <a href="#destacados" className="promo-banner__cta">
          Ver ofertas
        </a>
      </div>
    </aside>
  )
}

export default PromoBanner
