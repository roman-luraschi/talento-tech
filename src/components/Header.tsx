import '../css/Header.css'
import { Link, NavLink } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

function Header() {
  const { totalItemCount } = useStore()

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__brand">
          Talento Tech Store
        </Link>
        <nav className="header__nav" aria-label="Principal">
          <ul className="header__links">
            <li>
              <NavLink to="/" end>
                Inicio
              </NavLink>
            </li>
            <li>
              <Link to="/#destacados">Productos</Link>
            </li>
            <li>
              <NavLink to="/favoritos">Favoritos</NavLink>
            </li>
            <li>
              <NavLink to="/carrito" className="header__cart-link">
                Carrito
                {totalItemCount > 0 ? (
                  <span className="header__badge" aria-label={`${totalItemCount} artículos`}>
                    {totalItemCount}
                  </span>
                ) : null}
              </NavLink>
            </li>
            <li>
              <Link to="/#contacto">Contacto</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
