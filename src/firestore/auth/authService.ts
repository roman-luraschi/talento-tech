import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  type Unsubscribe,
  type User,
} from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { getFirebaseAuth } from '../config'
import { createClientProfile } from '../users/userService'

function mapAuthError(error: unknown): Error {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return new Error('Ese email ya está registrado.')
      case 'auth/invalid-email':
        return new Error('El email no es válido.')
      case 'auth/weak-password':
        return new Error('La contraseña debe tener al menos 6 caracteres.')
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return new Error('Email o contraseña incorrectos.')
      case 'auth/too-many-requests':
        return new Error('Demasiados intentos. Probá más tarde.')
      default:
        return new Error(error.message || 'Error de autenticación.')
    }
  }
  if (error instanceof Error) return error
  return new Error('Error de autenticación.')
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(
      getFirebaseAuth(),
      email,
      password,
    )
    return credential.user
  } catch (error: unknown) {
    throw mapAuthError(error)
  }
}

export async function registerWithEmail(
  email: string,
  password: string,
): Promise<User> {
  try {
    const credential = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      email,
      password,
    )
    await createClientProfile(credential.user.uid, credential.user.email ?? email)
    return credential.user
  } catch (error: unknown) {
    throw mapAuthError(error)
  }
}

export function subscribeToAuthChanges(
  callback: (user: User | null) => void,
): Unsubscribe {
  return onAuthStateChanged(getFirebaseAuth(), callback)
}
