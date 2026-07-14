import { collection, getDocs, type DocumentData } from 'firebase/firestore'
import { getDb } from '../config'
import type { Cupon } from '../../types/cupon'

export const CUPONES_COLLECTION = 'cupones'

function mapCupon(id: string, data: DocumentData): Cupon {
  return {
    id,
    codigo: String(data.codigo ?? '').trim(),
    descuento: Number(data.descuento ?? 0),
  }
}

export async function findCuponByCodigo(codigo: string): Promise<Cupon | null> {
  const normalized = codigo.trim().toLowerCase()
  if (!normalized) return null

  const snapshot = await getDocs(collection(getDb(), CUPONES_COLLECTION))
  const match = snapshot.docs.find((document) => {
    const raw = String(document.data().codigo ?? '')
      .trim()
      .toLowerCase()
    return raw === normalized
  })

  if (!match) return null

  const cupon = mapCupon(match.id, match.data())
  if (
    !Number.isFinite(cupon.descuento) ||
    cupon.descuento < 1 ||
    cupon.descuento > 100
  ) {
    return null
  }

  return cupon
}
