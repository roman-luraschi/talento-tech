export interface Category {
  id: string
  label: string
  slug: string
}

export interface Product {
  id: string
  name: string
  price: number
  categoryId: string
  imageUrl: string
  badge?: string
  description?: string
}

export interface CartLine {
  productId: string
  quantity: number
  name: string
  price: number
  imageUrl: string
}
