import type { CartLine } from './store'

export type UserRole = 'admin' | 'cliente'

export interface UserProfile {
  uid: string
  email: string
  role: UserRole
  cart: CartLine[]
  favoriteIds: string[]
  createdAt?: string
  updatedAt?: string
}
