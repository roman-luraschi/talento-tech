import { useState } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  Pagination,
} from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'
import CategoryStrip from '../components/CategoryStrip'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductGrid from '../components/ProductGrid'
import Seo from '../components/Seo'
import { categories } from '../data/mockStore'
import { useProducts } from '../context/ProductsContext'
import { useSearch } from '../context/SearchContext'
import { SearchField } from '../styles/buttons'
import '../css/ProductsPage.css'

const PRODUCTOS_POR_PAGINA = 4

function ProductsPage() {
  const { products, loading, error } = useProducts()
  const { busqueda, setBusqueda } = useSearch()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [filterKey, setFilterKey] = useState(
    () => `${busqueda}::${selectedCategoryId ?? ''}`,
  )

  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ?? null

  const query = busqueda.trim().toLowerCase()
  const productosFiltrados = products.filter((product) => {
    const matchesCategory = selectedCategoryId
      ? product.categoryId === selectedCategoryId
      : true
    const matchesSearch = query
      ? product.name.toLowerCase().includes(query) ||
        (product.description?.toLowerCase().includes(query) ?? false)
      : true

    return matchesCategory && matchesSearch
  })

  const nextFilterKey = `${busqueda}::${selectedCategoryId ?? ''}`
  if (nextFilterKey !== filterKey) {
    setFilterKey(nextFilterKey)
    setCurrentPage(1)
  }

  const totalPages = Math.max(
    1,
    Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA),
  )
  const page = Math.min(currentPage, totalPages)
  const startIndex = (page - 1) * PRODUCTOS_POR_PAGINA
  const productosVisibles = productosFiltrados.slice(
    startIndex,
    startIndex + PRODUCTOS_POR_PAGINA,
  )

  const resultLabel = selectedCategory
    ? `Mostrando ${productosVisibles.length} de ${productosFiltrados.length} en ${selectedCategory.label}`
    : `Mostrando ${productosVisibles.length} de ${productosFiltrados.length} productos`

  function goToPage(nextPage: number) {
    // Copy out of the param before setState (avoids
    // no-impure-state-updater resolving the param as the enclosing fn).
    const pageToShow = nextPage
    setCurrentPage(pageToShow)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const paginationItems = Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1
    return (
      <Pagination.Item
        key={pageNumber}
        active={pageNumber === page}
        onClick={() => goToPage(pageNumber)}
        aria-label={`Ir a la página ${pageNumber}`}
      >
        {pageNumber}
      </Pagination.Item>
    )
  })

  return (
    <div className="products-page">
      <Seo
        title="Productos | Talento Tech Store"
        description="Catálogo de Talento Tech. Filtrá por categoría o buscá por nombre."
      />
      <Container className="mt-4 products-page__container px-3">
        <header className="products-page__head">
          <div className="products-page__intro">
            <h1 className="products-page__title">Productos</h1>
            <p className="products-page__subtitle">
              Todo el catálogo. Filtrá por categoría o buscá por nombre.
            </p>
          </div>
          <p className="products-page__count" aria-live="polite">
            {loading ? 'Cargando…' : resultLabel}
          </p>
        </header>

        <div className="products-page__filters">
          <Row className="mb-3">
            <Col xs={12} md={8} lg={6}>
              <Form.Label
                htmlFor="products-search"
                className="products-page__search-label"
              >
                Buscar
              </Form.Label>
              <SearchField>
                <FaSearch className="search-field__icon" aria-hidden />
                <Form.Control
                  id="products-search"
                  type="search"
                  className="search-field__input"
                  placeholder="Buscar en los productos cargados…"
                  value={busqueda}
                  onChange={(event) => setBusqueda(event.target.value)}
                  autoComplete="off"
                  aria-label="Buscar productos por nombre"
                />
              </SearchField>
            </Col>
          </Row>

          <CategoryStrip
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </div>

        {loading ? (
          <LoadingSpinner label="Cargando productos..." />
        ) : error ? (
          <p className="products-page__empty" role="alert">
            {error}
          </p>
        ) : productosFiltrados.length === 0 ? (
          <p className="products-page__empty">
            No hay productos que coincidan con el filtro.
          </p>
        ) : (
          <>
            <ProductGrid products={productosVisibles} />

            {totalPages > 1 ? (
              <nav
                className="products-page__pagination"
                aria-label="Paginación de productos"
              >
                <Pagination className="justify-content-center mb-0">
                  <Pagination.Prev
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                    aria-label="Página anterior"
                  />
                  {paginationItems}
                  <Pagination.Next
                    disabled={page >= totalPages}
                    onClick={() => goToPage(page + 1)}
                    aria-label="Página siguiente"
                  />
                </Pagination>
                <p className="products-page__pagination-meta" aria-live="polite">
                  Página {page} de {totalPages}
                </p>
              </nav>
            ) : null}
          </>
        )}
      </Container>
    </div>
  )
}

export default ProductsPage
