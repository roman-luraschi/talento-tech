import { Navigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import Seo from '../components/Seo'
import { useAuth } from '../context/AuthContext'
import '../css/Login.css'

function LoginPage() {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="login-page">
        <p className="login-page__status">Cargando…</p>
      </div>
    )
  }

  if (user) {
    return (
      <Navigate to={isAdmin ? '/admin/productos' : '/perfil'} replace />
    )
  }

  return (
    <div className="login-page">
      <Seo
        title="Login | Talento Tech Store"
        description="Entrá a tu cuenta o creá una nueva en Talento Tech."
      />
      <div className="login-page__container">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
