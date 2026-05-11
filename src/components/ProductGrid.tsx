import type { Product } from '../types/store'
import TarjetaProducto from './TarjetaProducto'
import '../css/ProductGrid.css'

interface ProductGridProps {
  products: Product[]
}

function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="product-grid" role="list">
      {products.map((product) => (
        <div key={product.id} className="product-grid__cell" role="listitem">
          <TarjetaProducto product={product} />
        </div>
      ))}
    </div>
  )
}

export default ProductGrid
