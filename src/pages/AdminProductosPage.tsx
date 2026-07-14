import { useState, type FormEvent } from 'react'
import {
  addDoc,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { Button, Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import ProductAdminList from '../components/adminProductos/ProductAdminList'
import ProductForm from '../components/adminProductos/ProductForm'
import {
  useProductForm,
  type ProductFormFields,
} from '../components/adminProductos/useProductForm'
import Seo from '../components/Seo'
import { categories } from '../data/mockStore'
import { getDb } from '../firestore/config'
import {
  deleteProduct,
  PRODUCTS_COLLECTION,
} from '../firestore/products/productService'
import { useProducts } from '../context/ProductsContext'
import type { Product } from '../types/store'
import '../css/AdminProductos.css'

function AdminProductosPage() {
  const { products, loading, error, refetch } = useProducts()
  const [fields, dispatch] = useProductForm()

  const [productoAEditar, setProductoAEditar] = useState<Product | null>(null)
  const [productoAEliminar, setProductoAEliminar] = useState<Product | null>(
    null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function onFieldChange(name: keyof ProductFormFields, value: string) {
    dispatch({ type: 'fieldChanged', name, value })
  }

  function beginEdit(product: Product) {
    // Copy out of the param before setState (avoids
    // no-impure-state-updater resolving the param as the enclosing fn).
    const productToEdit = product
    setProductoAEditar(productToEdit)
    dispatch({ type: 'loadProduct', product: productToEdit })
  }

  function cancelEdit() {
    setProductoAEditar(null)
    dispatch({ type: 'reset' })
  }

  function onDeleteProduct(product: Product) {
    // Copy out of the param before setState (avoids
    // no-impure-state-updater resolving the param as the enclosing fn).
    const productToDelete = product
    setProductoAEliminar(productToDelete)
  }

  function closeDeleteModal() {
    if (deletingId !== null) return
    setProductoAEliminar(null)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!fields.name.trim()) {
      toast.error('El nombre del producto no puede estar vacío.')
      return
    }

    const priceNumber = Number(fields.price)
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      toast.error('El precio debe ser un valor numérico mayor que cero.')
      return
    }

    const payload = {
      name: fields.name.trim(),
      price: priceNumber,
      categoryId: fields.categoryId.trim() || categories[0]?.id || '',
      imageUrl: fields.imageUrl.trim(),
      badge: fields.badge.trim(),
      description: fields.description.trim(),
    }

    setIsSubmitting(true)
    try {
      if (productoAEditar === null) {
        await addDoc(collection(getDb(), PRODUCTS_COLLECTION), payload)
        dispatch({ type: 'reset' })
        toast.success('Producto creado')
      } else {
        await updateDoc(
          doc(getDb(), PRODUCTS_COLLECTION, productoAEditar.id),
          payload,
        )
        setProductoAEditar(null)
        dispatch({ type: 'reset' })
        toast.success('Producto actualizado')
      }

      await refetch()
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : productoAEditar === null
            ? 'No se pudo crear el producto.'
            : 'No se pudo actualizar el producto.'
      toast.error(message)
    }
    setIsSubmitting(false)
  }

  async function confirmDelete() {
    if (productoAEliminar === null) return

    const productToDelete = productoAEliminar
    setDeletingId(productToDelete.id)
    try {
      await deleteProduct(productToDelete.id)
      if (productoAEditar?.id === productToDelete.id) {
        setProductoAEditar(null)
        dispatch({ type: 'reset' })
      }
      await refetch()
      toast.success(`"${productToDelete.name}" eliminado`)
      setProductoAEliminar(null)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo eliminar el producto.'
      toast.error(message)
    }
    setDeletingId(null)
  }

  const isEditing = productoAEditar !== null
  const isDeleting = deletingId !== null

  return (
    <div className="admin-productos-page">
      <Seo
        title="Admin Productos | Talento Tech Store"
        description="Gestión de productos del catálogo en Talento Tech Store."
      />
      <div className="admin-productos-page__container">
        <header className="admin-productos-page__head">
          <h1 className="admin-productos-page__title">Gestión de productos</h1>
          <p className="admin-productos-page__subtitle">
            Creá, editá y eliminá productos en la colección Firestore{' '}
            <code>products</code>.
          </p>
        </header>

        <div className="admin-productos-page__stack">
          <ProductForm
            fields={fields}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            onFieldChange={onFieldChange}
            onSubmit={handleSubmit}
            onCancelEdit={cancelEdit}
          />

          <ProductAdminList
            products={products}
            loading={loading}
            error={error}
            editingProductId={productoAEditar?.id ?? null}
            deletingId={deletingId}
            isSubmitting={isSubmitting}
            onEdit={beginEdit}
            onDelete={onDeleteProduct}
          />
        </div>
      </div>

      <Modal
        show={productoAEliminar !== null}
        onHide={closeDeleteModal}
        centered
        aria-labelledby="delete-product-modal-title"
      >
        <Modal.Header closeButton={!isDeleting}>
          <Modal.Title id="delete-product-modal-title">
            Confirmar eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productoAEliminar ? (
            <p className="mb-0">
              ¿Eliminar <strong>{productoAEliminar.name}</strong>? Esta acción
              no se puede deshacer.
            </p>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeDeleteModal}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              void confirmDelete()
            }}
            disabled={isDeleting}
          >
            {isDeleting ? 'Eliminando…' : 'Eliminar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AdminProductosPage
