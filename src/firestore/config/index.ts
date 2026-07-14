import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

function assertFirebaseConfig(): void {
  const missing: string[] = []
  for (const [key, value] of Object.entries(firebaseConfig)) {
    if (!value) missing.push(key)
  }

  if (missing.length > 0) {
    throw new Error(
      `Faltan variables de Firebase: ${missing.join(', ')}. Revisá tu archivo .env`,
    )
  }
}

let app: FirebaseApp | undefined
let firestore: Firestore | undefined
let auth: Auth | undefined

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    assertFirebaseConfig()
    app = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig)
  }
  return app
}

export function getDb(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp())
  }
  return firestore
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp())
  }
  return auth
}
