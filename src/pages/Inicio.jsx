import { useState } from 'react'
import Hero from '../components/Hero'
import CategoryStrip from '../components/CategoryStrip'
import SectionHeading from '../components/SectionHeading'
import ProductGrid from '../components/ProductGrid'
import PromoBanner from '../components/PromoBanner'
import Seo from '../components/Seo'
import LoadingSpinner from '../components/LoadingSpinner'
import { categories } from '../data/mockStore'
import { useProducts } from '../context/ProductsContext'
import '../css/Inicio.css'

function Inicio() {
  const { loading, error, products, getFeaturedProducts } = useProducts()
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)

  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ?? null

  const displayedProducts = !selectedCategoryId
    ? getFeaturedProducts()
    : products.filter((product) => product.categoryId === selectedCategoryId)

  const sectionTitle = selectedCategory
    ? selectedCategory.label
    : 'Lo que más se lleva'

  const sectionSubtitle = selectedCategory
    ? `Todo lo que hay en ${selectedCategory.label}, en pesos.`
    : 'Algunos de los productos que más nos piden.'

  const emptyMessage = selectedCategory
    ? `No hay productos en ${selectedCategory.label} por el momento.`
    : 'No hay productos destacados por el momento.'

  return (
    <div className="inicio">
      <Seo
        title="Inicio | Talento Tech Store"
        description="Tienda online de Talento Tech: electrónica, hogar, deporte y más. Precios en pesos."
      />
      <Hero />
      <CategoryStrip
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />
      <section
        id="destacados"
        className="inicio__section inicio__section--destacados"
        aria-labelledby="destacados-heading"
      >
        <div className="inicio__container">
          <SectionHeading
            id="destacados-heading"
            title={sectionTitle}
            subtitle={sectionSubtitle}
          />
          {loading ? (
            <LoadingSpinner label="Cargando productos..." />
          ) : error ? (
            <p className="inicio__empty" role="alert">
              {error}
            </p>
          ) : displayedProducts.length > 0 ? (
            <ProductGrid products={displayedProducts} />
          ) : (
            <p className="inicio__empty">{emptyMessage}</p>
          )}
        </div>
      </section>
      <PromoBanner />
    </div>
  )
}

export default Inicio
