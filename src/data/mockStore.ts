import type { Category } from '../types/store'

export const categories: Category[] = [
  { id: 'cat-electronics', label: 'Electrónica', slug: 'electronica' },
  { id: 'cat-home', label: 'Hogar', slug: 'hogar' },
  { id: 'cat-fashion', label: 'Moda', slug: 'moda' },
  { id: 'cat-sports', label: 'Deportes', slug: 'deportes' },
  { id: 'cat-books', label: 'Libros', slug: 'libros' },
  { id: 'cat-beauty', label: 'Belleza', slug: 'belleza' },
]

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}
