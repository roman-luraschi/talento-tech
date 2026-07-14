import { Link, useNavigate } from 'react-router-dom'
import Seo from '../components/Seo'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import '../css/Perfil.css'

function Perfil() {
  const { user, profile, isAdmin, logout } = useAuth()
  const { totalItemCount, favoriteIds } = useStore()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      navigate('/', { replace: true })
    } catch {
      window.alert('No se pudo cerrar la sesión.')
    }
  }

  const email = user?.email ?? profile?.email ?? 'usuario'

  return (
    <div className="perfil-page">
      <Seo
        title="Mi Perfil | Talento Tech Store"
        description="Tu cuenta en Talento Tech: carrito, favoritos y datos de sesión."
      />
      <div className="perfil-page__container">
        <section className="perfil-card">
          <h1 className="perfil-card__title">Mi Perfil</h1>
          <p className="perfil-card__welcome">Hola, {email}</p>
          <ul className="perfil-card__stats">
            <li>
              Productos en carrito: <strong>{totalItemCount}</strong>
            </li>
            <li>
              Favoritos: <strong>{favoriteIds.length}</strong>
            </li>
          </ul>
          <div className="perfil-card__links">
            <Link to="/carrito">Ver carrito</Link>
            <Link to="/favoritos">Ver favoritos</Link>
            {isAdmin ? <Link to="/admin/productos">Panel admin</Link> : null}
          </div>
          <button
            type="button"
            className="perfil-card__logout"
            onClick={() => void handleLogout()}
            aria-label="Cerrar sesión"
          >
            Cerrar Sesión
          </button>
        </section>
      </div>
    </div>
  )
}

export default Perfil
