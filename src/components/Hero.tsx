import '../css/Hero.css'

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow">Talento Tech</p>
          <h1 id="hero-heading" className="hero__title">
            Tecnología y más, sin vueltas
          </h1>
          <p className="hero__lead">
            Electrónica, hogar, deporte y lo que necesites del día a día.
            Precios en pesos y envíos a todo el país.
          </p>
          <a href="#destacados" className="hero__cta">
            Ver productos
          </a>
        </div>
        <div className="hero__visual" aria-hidden />
      </div>
    </section>
  )
}

export default Hero
