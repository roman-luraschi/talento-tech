import {
  collection,
  getDocs,
  type DocumentData,
} from 'firebase/firestore'
import { getDb } from '../config'
import type { Integrante } from '../../types/equipo'

const EQUIPO_COLLECTION = 'equipo'

function mapIntegrante(id: string, data: DocumentData): Integrante {
  return {
    id,
    nombre: String(data.nombre ?? ''),
    rol: String(data.rol ?? ''),
    linkedinURL: String(data.linkedinURL ?? ''),
    fotoURL: String(data.fotoURL ?? ''),
  }
}

export async function getEquipo(): Promise<Integrante[]> {
  const snapshot = await getDocs(collection(getDb(), EQUIPO_COLLECTION))
  return snapshot.docs.map((document) =>
    mapIntegrante(document.id, document.data()),
  )
}

export { EQUIPO_COLLECTION }
