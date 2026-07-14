import { FaEdit, FaTrash } from 'react-icons/fa'
import LoadingSpinner from '../LoadingSpinner'
import { getCategoryById } from '../../data/mockStore'
import type { Product } from '../../types/store'
import {
  BotonEditar,
  BotonEliminar,
  ProductoInfo,
  ProductoItem,
} from '../../styles/buttons'

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
})

interface ProductAdminListProps {
  products: Product[]
  loading: boolean
  error: string | null
  editingProductId: string | null
  deletingId: string | null
  isSubmitting: boolean
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

function ProductAdminList({
  products,
  loading,
  error,
  editingProductId,
  deletingId,
  isSubmitting,
  onEdit,
  onDelete,
}: ProductAdminListProps) {
  if (loading) {
    return <LoadingSpinner label="Cargando productos..." height="20vh" />
  }

  if (error) {
    return (
      <p
        className="product-admin-list__status product-admin-list__status--error"
        role="alert"
      >
        {error}
      </p>
    )
  }

  if (products.length === 0) {
    return (
      <p className="product-admin-list__status">
        Todavía no hay productos. Creá el primero con el formulario.
      </p>
    )
  }

  return (
    <div className="product-admin-list">
      <h2 className="product-admin-list__title">Lista de Productos</h2>
      <ul className="product-admin-list__items" aria-label="Lista de productos">
        {products.map((product) => {
          const isItemEditing = editingProductId === product.id
          const category = getCategoryById(product.categoryId)
          return (
            <ProductoItem
              key={product.id}
              className={isItemEditing ? 'producto-item--editing' : undefined}
            >
              <ProductoInfo>
                <strong>{product.name}</strong>
                <span className="product-admin-item__price">
                  {category?.label ?? product.categoryId} —{' '}
                  {priceFormatter.format(product.price)}
                </span>
              </ProductoInfo>
              <div className="d-flex flex-wrap gap-2">
                <BotonEditar
                  type="button"
                  onClick={() => onEdit(product)}
                  disabled={isItemEditing || deletingId === product.id}
                  aria-label={`Editar producto ${product.name}`}
                >
                  <FaEdit aria-hidden />
                  {isItemEditing ? 'Editando…' : 'Editar'}
                </BotonEditar>
                <BotonEliminar
                  type="button"
                  onClick={() => onDelete(product)}
                  disabled={isSubmitting || deletingId === product.id}
                  aria-label={`Eliminar producto ${product.name}`}
                >
                  <FaTrash aria-hidden />
                  {deletingId === product.id ? 'Eliminando…' : 'Eliminar'}
                </BotonEliminar>
              </div>
            </ProductoItem>
          )
        })}
      </ul>
    </div>
  )
}

export default ProductAdminList
