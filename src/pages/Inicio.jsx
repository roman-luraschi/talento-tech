import Hero from '../components/Hero'
import CategoryStrip from '../components/CategoryStrip'
import SectionHeading from '../components/SectionHeading'
import ProductGrid from '../components/ProductGrid'
import PromoBanner from '../components/PromoBanner'
import { categories, getFeaturedProducts } from '../data/mockStore'
import '../css/Inicio.css'

function Inicio() {
  const featuredProducts = getFeaturedProducts()

  return (
    <div className="inicio">
      <Hero />
      <CategoryStrip categories={categories} />
      <section
        id="destacados"
        className="inicio__section inicio__section--destacados"
        aria-labelledby="destacados-heading"
      >
        <div className="inicio__container">
          <SectionHeading
            id="destacados-heading"
            title="Productos destacados"
            subtitle="Selección especial con novedades y ofertas de la semana. Precios en pesos (ARS)."
          />
          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <p className="inicio__empty">No hay productos destacados por el momento.</p>
          )}
        </div>
      </section>
      <PromoBanner />
    </div>
  )
}

export default Inicio
