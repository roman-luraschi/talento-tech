import '../css/Hero.css'

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow">Nueva temporada</p>
          <h1 id="hero-heading" className="hero__title">
            Todo lo que buscás, en un solo lugar
          </h1>
          <p className="hero__lead">
            Descubrí productos seleccionados y ofertas especiales. Envíos a todo
            el país y compra segura.
          </p>
          <a href="#catalogo" className="hero__cta">
            Ver catálogo
          </a>
        </div>
        <div className="hero__visual" aria-hidden />
      </div>
    </section>
  )
}

export default Hero
