import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { signOut, type User } from 'firebase/auth'
import {
  loginWithEmail,
  registerWithEmail,
  subscribeToAuthChanges,
} from '../firestore/auth/authService'
import { getFirebaseAuth } from '../firestore/config'
import { ensureUserProfile } from '../firestore/users/userService'
import type { UserProfile, UserRole } from '../types/user'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  role: UserRole | null
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<UserProfile>
  register: (email: string, password: string) => Promise<UserProfile>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      void (async () => {
        if (!firebaseUser) {
          if (!cancelled) {
            setUser(null)
            setProfile(null)
            setLoading(false)
          }
          return
        }

        const signedInUser = firebaseUser

        if (!cancelled) {
          setLoading(true)
          setUser(signedInUser)
        }

        try {
          const nextProfile = await ensureUserProfile(
            signedInUser.uid,
            signedInUser.email ?? '',
          )
          if (!cancelled) {
            setProfile(nextProfile)
          }
        } catch {
          if (!cancelled) {
            setProfile(null)
          }
        }
        if (!cancelled) {
          setLoading(false)
        }
      })()
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  async function login(email: string, password: string) {
    const nextUser = await loginWithEmail(email, password)
    const nextProfile = await ensureUserProfile(
      nextUser.uid,
      nextUser.email ?? email,
    )
    setUser(nextUser)
    setProfile(nextProfile)
    setLoading(false)
    return nextProfile
  }

  async function register(email: string, password: string) {
    const nextUser = await registerWithEmail(email, password)
    const nextProfile = await ensureUserProfile(
      nextUser.uid,
      nextUser.email ?? email,
    )
    setUser(nextUser)
    setProfile(nextProfile)
    setLoading(false)
    return nextProfile
  }

  async function logout() {
    await signOut(getFirebaseAuth())
    setUser(null)
    setProfile(null)
  }

  const role = profile?.role ?? null
  const isAdmin = role === 'admin'

  const value: AuthContextValue = {
    user,
    profile,
    role,
    isAdmin,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
