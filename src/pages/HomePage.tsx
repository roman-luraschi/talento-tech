import Hero from '../components/Hero'
import CategoryStrip from '../components/CategoryStrip'
import SectionHeading from '../components/SectionHeading'
import ProductGrid from '../components/ProductGrid'
import PromoBanner from '../components/PromoBanner'
import { categories, products } from '../data/mockStore'
import '../css/HomePage.css'

function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <CategoryStrip categories={categories} />
      <section
        id="catalogo"
        className="home-page__section home-page__section--catalog"
        aria-labelledby="catalog-heading"
      >
        <div className="home-page__container">
          <SectionHeading
            id="catalog-heading"
            title="Catálogo destacado"
            subtitle="Productos populares esta semana. Precios en pesos (ARS)."
          />
          <ProductGrid products={products} />
        </div>
      </section>
      <PromoBanner />
    </div>
  )
}

export default HomePage
