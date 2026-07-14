import type { FormEvent } from 'react'
import { categories } from '../../data/mockStore'
import type { ProductFormFields } from './useProductForm'

interface ProductFormProps {
  fields: ProductFormFields
  isEditing: boolean
  isSubmitting: boolean
  onFieldChange: (name: keyof ProductFormFields, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancelEdit: () => void
}

function ProductForm({
  fields,
  isEditing,
  isSubmitting,
  onFieldChange,
  onSubmit,
  onCancelEdit,
}: ProductFormProps) {
  return (
    <form
      className="product-form p-4 border rounded shadow"
      onSubmit={onSubmit}
      noValidate
    >
      <h2 className="product-form__title">
        {isEditing ? 'Editar producto' : 'Agregar Producto'}
      </h2>

      <div className="product-form__fields">
        <label className="product-form__field">
          <span className="product-form__label">Nombre</span>
          <input
            className="product-form__input form-control"
            type="text"
            name="name"
            value={fields.name}
            onChange={(event) => onFieldChange('name', event.target.value)}
            disabled={isSubmitting}
            autoComplete="off"
            required
          />
        </label>

        <label className="product-form__field product-form__field--narrow">
          <span className="product-form__label">Precio (ARS)</span>
          <input
            className="product-form__input form-control"
            type="number"
            name="price"
            value={fields.price}
            onChange={(event) => onFieldChange('price', event.target.value)}
            min={0}
            step="0.01"
            disabled={isSubmitting}
            required
          />
        </label>

        <label className="product-form__field">
          <span className="product-form__label">Categoría</span>
          <select
            className="product-form__input form-select"
            name="categoryId"
            value={fields.categoryId}
            onChange={(event) =>
              onFieldChange('categoryId', event.target.value)
            }
            disabled={isSubmitting}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="product-form__field product-form__field--full">
          <span className="product-form__label">URL de imagen</span>
          <input
            className="product-form__input form-control"
            type="url"
            name="imageUrl"
            value={fields.imageUrl}
            onChange={(event) => onFieldChange('imageUrl', event.target.value)}
            placeholder="https://…"
            disabled={isSubmitting}
          />
        </label>

        <label className="product-form__field">
          <span className="product-form__label">Badge (opcional)</span>
          <input
            className="product-form__input form-control"
            type="text"
            name="badge"
            value={fields.badge}
            onChange={(event) => onFieldChange('badge', event.target.value)}
            placeholder="Ej: Nuevo, Oferta"
            disabled={isSubmitting}
          />
        </label>

        <label className="product-form__field product-form__field--full">
          <span className="product-form__label">Descripción (opcional)</span>
          <textarea
            className="product-form__input product-form__textarea form-control"
            name="description"
            value={fields.description}
            onChange={(event) =>
              onFieldChange('description', event.target.value)
            }
            rows={3}
            disabled={isSubmitting}
          />
        </label>
      </div>

      <div className="product-form__actions">
        <button
          type="submit"
          className="product-form__submit btn btn-primary btn-lg"
          disabled={isSubmitting}
          aria-label={isEditing ? 'Actualizar producto' : 'Agregar producto'}
        >
          {isSubmitting
            ? 'Guardando…'
            : isEditing
              ? 'Actualizar Producto'
              : 'Agregar Producto'}
        </button>

        {isEditing ? (
          <button
            type="button"
            className="product-form__cancel btn btn-outline-secondary btn-lg"
            onClick={onCancelEdit}
            disabled={isSubmitting}
            aria-label="Cancelar edición"
          >
            Cancelar edición
          </button>
        ) : null}
      </div>
    </form>
  )
}

export default ProductForm
