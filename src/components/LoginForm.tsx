import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import '../css/Login.css'

type AuthMode = 'login' | 'register'

function LoginForm() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fromPath =
    typeof location.state === 'object' &&
    location.state !== null &&
    'from' in location.state &&
    typeof (location.state as { from?: unknown }).from === 'string'
      ? (location.state as { from: string }).from
      : null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const emailTrimmed = email.trim()
    if (!emailTrimmed || !password) {
      setError('Ingresá email y contraseña.')
      return
    }

    if (mode === 'register') {
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.')
        return
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.')
        return
      }
    }

    setIsSubmitting(true)
    try {
      if (mode === 'register') {
        const profile = await register(emailTrimmed, password)
        toast.success('Listo, ya tenés tu cuenta.')
        navigate(
          fromPath ??
            (profile.role === 'admin' ? '/admin/productos' : '/perfil'),
          { replace: true },
        )
      } else {
        const profile = await login(emailTrimmed, password)
        toast.success('Sesión iniciada correctamente')
        navigate(
          fromPath ??
            (profile.role === 'admin' ? '/admin/productos' : '/perfil'),
          { replace: true },
        )
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'No se pudo completar la operación.'
      setError(message)
      toast.error(message)
    }
    setIsSubmitting(false)
  }

  return (
    <Form
      className="login-form p-4 border rounded shadow"
      onSubmit={handleSubmit}
      noValidate
    >
      <h1 className="login-form__title">
        {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      </h1>
      <p className="login-form__subtitle">
        {mode === 'login'
          ? 'Usá el email y la contraseña de tu cuenta.'
          : 'Creá una cuenta para guardar el carrito y los favoritos.'}
      </p>

      <Form.Group className="mb-3" controlId="login-email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          disabled={isSubmitting}
          required
          placeholder="Ingresá tu email"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="login-password">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={
            mode === 'login' ? 'current-password' : 'new-password'
          }
          disabled={isSubmitting}
          required
          placeholder="********"
        />
      </Form.Group>

      {mode === 'register' ? (
        <Form.Group className="mb-3" controlId="login-confirm">
          <Form.Label>Confirmar contraseña</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            disabled={isSubmitting}
            required
            placeholder="********"
          />
        </Form.Group>
      ) : null}

      {error ? (
        <p className="login-form__error" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        className="w-100 d-inline-flex align-items-center justify-content-center gap-2"
        disabled={isSubmitting}
        aria-label={mode === 'login' ? 'Ingresar' : 'Registrarse'}
      >
        {mode === 'login' ? (
          <FaSignInAlt aria-hidden />
        ) : (
          <FaUserPlus aria-hidden />
        )}
        {isSubmitting
          ? mode === 'login'
            ? 'Ingresando…'
            : 'Registrando…'
          : mode === 'login'
            ? 'Ingresar'
            : 'Registrarme'}
      </Button>

      <p className="login-form__switch mt-3 mb-0 text-center">
        {mode === 'login' ? (
          <>
            ¿No tenés cuenta?{' '}
            <button
              type="button"
              className="login-form__link"
              onClick={() => {
                setMode('register')
                setError(null)
              }}
            >
              Registrate
            </button>
          </>
        ) : (
          <>
            ¿Ya tenés cuenta?{' '}
            <button
              type="button"
              className="login-form__link"
              onClick={() => {
                setMode('login')
                setError(null)
              }}
            >
              Iniciá sesión
            </button>
          </>
        )}
      </p>

      <p className="login-form__switch mt-2 mb-0 text-center">
        <Link to="/">Volver al inicio</Link>
      </p>
    </Form>
  )
}

export default LoginForm
