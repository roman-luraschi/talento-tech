import {
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { getDb } from '../config'
import type { CartLine } from '../../types/store'

export const USERS_COLLECTION = 'users'

/** Client writes never include authority fields — those are Console / Admin SDK only. */
export async function createUserDocument(
  uid: string,
  email: string,
): Promise<void> {
  await setDoc(doc(getDb(), USERS_COLLECTION, uid), {
    email,
    cart: [],
    favoriteIds: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateUserEmail(
  uid: string,
  email: string,
): Promise<void> {
  await updateDoc(doc(getDb(), USERS_COLLECTION, uid), {
    email,
    updatedAt: serverTimestamp(),
  })
}

export async function saveUserCart(
  uid: string,
  cart: CartLine[],
): Promise<void> {
  await updateDoc(doc(getDb(), USERS_COLLECTION, uid), {
    cart,
    updatedAt: serverTimestamp(),
  })
}

export async function saveUserFavorites(
  uid: string,
  favoriteIds: string[],
): Promise<void> {
  await updateDoc(doc(getDb(), USERS_COLLECTION, uid), {
    favoriteIds,
    updatedAt: serverTimestamp(),
  })
}
