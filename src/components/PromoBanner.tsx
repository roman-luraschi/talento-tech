import '../css/PromoBanner.css'

function PromoBanner() {
  return (
    <aside id="ofertas" className="promo-banner" aria-labelledby="promo-heading">
      <div className="promo-banner__inner">
        <div className="promo-banner__content">
          <h2 id="promo-heading" className="promo-banner__title">
            Envío gratis desde $100.000
          </h2>
          <p className="promo-banner__text">
            Y si no te cierra el producto, tenés 30 días para cambiarlo o
            devolverlo.
          </p>
        </div>
        <a href="#destacados" className="promo-banner__cta">
          Ver más
        </a>
      </div>
    </aside>
  )
}

export default PromoBanner
