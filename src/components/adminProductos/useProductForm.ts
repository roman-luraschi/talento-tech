import { useReducer } from 'react'
import { categories } from '../../data/mockStore'
import type { Product } from '../../types/store'

export interface ProductFormFields {
  name: string
  price: string
  categoryId: string
  imageUrl: string
  badge: string
  description: string
}

export const emptyProductForm = (): ProductFormFields => ({
  name: '',
  price: '',
  categoryId: categories[0]?.id ?? '',
  imageUrl: '',
  badge: '',
  description: '',
})

export function productToFormFields(product: Product): ProductFormFields {
  return {
    name: product.name,
    price: String(product.price),
    categoryId: product.categoryId || categories[0]?.id || '',
    imageUrl: product.imageUrl,
    badge: product.badge ?? '',
    description: product.description ?? '',
  }
}

type ProductFormAction =
  | { type: 'fieldChanged'; name: keyof ProductFormFields; value: string }
  | { type: 'reset' }
  | { type: 'loadProduct'; product: Product }

function productFormReducer(
  state: ProductFormFields,
  action: ProductFormAction,
): ProductFormFields {
  switch (action.type) {
    case 'fieldChanged':
      return { ...state, [action.name]: action.value }
    case 'reset':
      return emptyProductForm()
    case 'loadProduct':
      return productToFormFields(action.product)
    default:
      return state
  }
}

export function useProductForm(initial?: ProductFormFields) {
  return useReducer(productFormReducer, initial ?? emptyProductForm())
}
