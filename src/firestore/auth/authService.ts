import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  type Unsubscribe,
  type User,
} from 'firebase/auth'
import { getFirebaseAuth } from '../config'
import { createClientProfile } from '../users/userService'
import { toFriendlyError } from '../../lib/errors/mapErrorMessage'

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
    throw toFriendlyError(error, 'auth')
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
    throw toFriendlyError(error, 'auth')
  }
}

export function subscribeToAuthChanges(
  callback: (user: User | null) => void,
): Unsubscribe {
  return onAuthStateChanged(getFirebaseAuth(), callback)
}
