import { FirebaseError } from 'firebase/app'

export type ErrorContext =
  | 'auth'
  | 'products'
  | 'product-write'
  | 'coupon'
  | 'coupon-apply'
  | 'equipo'
  | 'generic'

const CONTEXT_FALLBACKS: Record<ErrorContext, string> = {
  auth: 'No se pudo completar el inicio de sesión. Probá de nuevo.',
  products: 'No pudimos cargar el catálogo. Revisá tu conexión e intentá otra vez.',
  'product-write': 'No se pudo guardar el producto. Probá de nuevo en unos segundos.',
  coupon: 'No pudimos cargar los cupones. Intentá otra vez.',
  'coupon-apply': 'No se pudo aplicar el cupón. Revisá el código e intentá de nuevo.',
  equipo: 'No pudimos cargar el equipo. Intentá más tarde.',
  generic: 'Algo salió mal. Probá de nuevo en unos segundos.',
}

const AUTH_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Ese email ya está registrado.',
  'auth/invalid-email': 'El email no es válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/user-not-found': 'Email o contraseña incorrectos.',
  'auth/wrong-password': 'Email o contraseña incorrectos.',
  'auth/invalid-credential': 'Email o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Probá más tarde.',
  'auth/network-request-failed':
    'Sin conexión. Revisá tu internet e intentá de nuevo.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada. Contactá al soporte.',
  'auth/operation-not-allowed':
    'Este método de acceso no está disponible por ahora.',
}

const FIRESTORE_MESSAGES: Record<string, string> = {
  'permission-denied':
    'No tenés permiso para hacer esta acción. Si creés que es un error, iniciá sesión de nuevo.',
  'unauthenticated': 'Tenés que iniciar sesión para continuar.',
  'not-found': 'No encontramos lo que buscabas.',
  'unavailable':
    'El servicio no está disponible en este momento. Probá en unos minutos.',
  'deadline-exceeded': 'La operación tardó demasiado. Intentá de nuevo.',
  'resource-exhausted': 'Hay mucha demanda ahora. Esperá un momento e intentá otra vez.',
  'cancelled': 'La operación se canceló. Intentá de nuevo.',
  'already-exists': 'Ese registro ya existe.',
  'failed-precondition':
    'No se pudo completar la operación con el estado actual. Revisá los datos e intentá otra vez.',
  'aborted': 'La operación se interrumpió. Intentá de nuevo.',
  'out-of-range': 'Hay un valor fuera de rango. Revisá los datos.',
  'unimplemented': 'Esta función no está disponible por ahora.',
  'internal': 'Hubo un problema interno. Probá más tarde.',
  'data-loss': 'Hubo un problema al guardar los datos. Intentá de nuevo.',
  'invalid-argument': 'Hay datos inválidos. Revisá el formulario e intentá otra vez.',
}

function normalizeFirebaseCode(code: string): string {
  return code.replace(/^(firestore|storage)\//, '')
}

function messageForFirebaseCode(
  code: string,
  context: ErrorContext,
): string | null {
  if (code.startsWith('auth/')) {
    return AUTH_MESSAGES[code] ?? CONTEXT_FALLBACKS.auth
  }

  const normalized = normalizeFirebaseCode(code)
  if (FIRESTORE_MESSAGES[normalized]) {
    return FIRESTORE_MESSAGES[normalized]
  }

  if (context === 'product-write' && normalized === 'permission-denied') {
    return 'No tenés permiso para administrar productos. Iniciá sesión como admin.'
  }

  if (context === 'coupon-apply' && normalized === 'permission-denied') {
    return 'No se pudo validar el cupón. Probá más tarde.'
  }

  return null
}

function looksTechnical(message: string): boolean {
  return /firebase|firestore|cloud firestore|permission-denied|missing or insufficient|failed_precondition|grpc|network request failed|auth\/|https?:\/\//i.test(
    message,
  )
}

/**
 * Traduce errores técnicos (Firebase, red, etc.) a mensajes claros para el cliente.
 * Conserva mensajes de negocio en español que ya lanzó la app.
 */
export function mapErrorMessage(
  error: unknown,
  context: ErrorContext = 'generic',
  fallback?: string,
): string {
  const defaultMessage = fallback ?? CONTEXT_FALLBACKS[context]

  if (error instanceof FirebaseError) {
    return messageForFirebaseCode(error.code, context) ?? defaultMessage
  }

  if (error instanceof Error && error.message.trim()) {
    if (!looksTechnical(error.message)) {
      return error.message
    }
    return defaultMessage
  }

  return defaultMessage
}

export function toFriendlyError(
  error: unknown,
  context: ErrorContext = 'generic',
  fallback?: string,
): Error {
  return new Error(mapErrorMessage(error, context, fallback))
}
