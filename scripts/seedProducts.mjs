import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp } from 'firebase/app'
import { doc, getFirestore, writeBatch } from 'firebase/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return
  const text = readFileSync(filePath, 'utf8')
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(resolve(rootDir, '.env'))
loadEnvFile(resolve(rootDir, '.env.local'))

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const missing = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missing.length > 0) {
  console.error(
    `Faltan variables en .env: ${missing.join(', ')}\nCopiá .env.example → .env y completá los valores de Firebase Console.`,
  )
  process.exit(1)
}

const products = JSON.parse(
  readFileSync(resolve(__dirname, 'products.seed.json'), 'utf8'),
)

async function seed() {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const batch = writeBatch(db)

  for (const product of products) {
    const { id, ...data } = product
    batch.set(doc(db, 'products', id), data, { merge: true })
  }

  await batch.commit()
  console.log(`OK: ${products.length} productos subidos a products/`)
  products.forEach((p) => console.log(`  - ${p.id}: ${p.name}`))
}

seed().catch((err) => {
  console.error('Error al seedear productos:', err.message ?? err)
  console.error(
    '\nSi el error es permission-denied, abrí temporalmente escritura en Firestore Rules (ver firestore.rules).',
  )
  process.exit(1)
})
