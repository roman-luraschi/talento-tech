import type { Category, Product } from '../types/store'

export const categories: Category[] = [
  { id: 'cat-electronics', label: 'Electrónica', slug: 'electronica' },
  { id: 'cat-home', label: 'Hogar', slug: 'hogar' },
  { id: 'cat-fashion', label: 'Moda', slug: 'moda' },
  { id: 'cat-sports', label: 'Deportes', slug: 'deportes' },
  { id: 'cat-books', label: 'Libros', slug: 'libros' },
  { id: 'cat-beauty', label: 'Belleza', slug: 'belleza' },
]

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Auriculares Bluetooth Pro',
    price: 15000,
    categoryId: 'cat-electronics',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    badge: 'Nuevo',
  },
  {
    id: 'p2',
    name: 'Reloj inteligente Sport',
    price: 149000,
    categoryId: 'cat-electronics',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    badge: 'Oferta',
  },
  {
    id: 'p3',
    name: 'Lámpara de escritorio LED',
    price: 45500,
    categoryId: 'cat-home',
    imageUrl:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
  },
  {
    id: 'p4',
    name: 'Mochila urbana impermeable',
    price: 62000,
    categoryId: 'cat-fashion',
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
  },
  {
    id: 'p5',
    name: 'Mat de yoga antideslizante',
    price: 34990,
    categoryId: 'cat-sports',
    imageUrl:
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop',
    badge: 'Nuevo',
  },
  {
    id: 'p6',
    name: 'Guía de diseño UX',
    price: 28000,
    categoryId: 'cat-books',
    imageUrl:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
  },
  {
    id: 'p7',
    name: 'Set cuidado facial',
    price: 55000,
    categoryId: 'cat-beauty',
    imageUrl:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    badge: 'Oferta',
  },
  {
    id: 'p8',
    name: 'Botella térmica 750 ml',
    price: 22990,
    categoryId: 'cat-sports',
    imageUrl:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
