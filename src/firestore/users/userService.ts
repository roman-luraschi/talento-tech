import { doc, getDoc } from 'firebase/firestore'
import { getDb } from '../config'
import type { CartLine } from '../../types/store'
import type { UserProfile, UserRole } from '../../types/user'
import {
  createUserDocument,
  updateUserEmail,
  USERS_COLLECTION,
} from './userDocWrites'

export { USERS_COLLECTION, saveUserCart, saveUserFavorites } from './userDocWrites'

function isValidCartLine(item: unknown): item is CartLine {
  if (item === null || typeof item !== 'object') return false
  const o = item as Record<string, unknown>
  return (
    typeof o.productId === 'string' &&
    typeof o.quantity === 'number' &&
    o.quantity > 0 &&
    typeof o.name === 'string' &&
    typeof o.price === 'number' &&
    typeof o.imageUrl === 'string'
  )
}

function mapProfile(uid: string, data: Record<string, unknown>): UserProfile {
  const role: UserRole = data.role === 'admin' ? 'admin' : 'cliente'
  const cartRaw = Array.isArray(data.cart) ? data.cart : []
  const favoritesRaw = Array.isArray(data.favoriteIds) ? data.favoriteIds : []

  return {
    uid,
    email: String(data.email ?? ''),
    role,
    cart: cartRaw.filter(isValidCartLine),
    favoriteIds: favoritesRaw.filter((id): id is string => typeof id === 'string'),
    createdAt:
      typeof data.createdAt === 'string' ? data.createdAt : undefined,
    updatedAt:
      typeof data.updatedAt === 'string' ? data.updatedAt : undefined,
  }
}

export async function getUserProfile(
  uid: string,
): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(getDb(), USERS_COLLECTION, uid))
  if (!snapshot.exists()) return null
  return mapProfile(uid, snapshot.data() as Record<string, unknown>)
}

/**
 * Crea o lee el perfil. El cliente nunca escribe campos de autoridad;
 * sin valor en el doc, mapProfile asume cliente. Admin se setea en Console.
 */
export async function ensureUserProfile(
  uid: string,
  email: string,
): Promise<UserProfile> {
  const ref = doc(getDb(), USERS_COLLECTION, uid)
  const snapshot = await getDoc(ref)

  if (!snapshot.exists()) {
    await createUserDocument(uid, email)
    const created = await getUserProfile(uid)
    if (created) return { ...created, email }
    return mapProfile(uid, { email, cart: [], favoriteIds: [] })
  }

  const existing = mapProfile(uid, snapshot.data() as Record<string, unknown>)

  if (existing.email !== email) {
    await updateUserEmail(uid, email)
  }

  return { ...existing, email }
}

export async function createClientProfile(
  uid: string,
  email: string,
): Promise<UserProfile> {
  await createUserDocument(uid, email)
  const created = await getUserProfile(uid)
  if (created) return { ...created, email }
  return mapProfile(uid, { email, cart: [], favoriteIds: [] })
}
