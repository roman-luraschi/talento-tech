import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  type DocumentData,
} from 'firebase/firestore'
import { getDb } from '../config'
import type { Product } from '../../types/store'

const PRODUCTS_COLLECTION = 'products'

function mapProduct(id: string, data: DocumentData): Product {
  return {
    id,
    name: String(data.name ?? ''),
    price: Number(data.price ?? 0),
    categoryId: String(data.categoryId ?? ''),
    imageUrl: String(data.imageUrl ?? ''),
    badge: data.badge ? String(data.badge) : undefined,
    description: data.description ? String(data.description) : undefined,
  }
}

export async function getProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(getDb(), PRODUCTS_COLLECTION))
  return snapshot.docs.map((document) => mapProduct(document.id, document.data()))
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(getDb(), PRODUCTS_COLLECTION, id))
}

export { PRODUCTS_COLLECTION }
