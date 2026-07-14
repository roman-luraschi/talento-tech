import { useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Badge from 'react-bootstrap/Badge'
import {
  FaShoppingCart,
  FaHeart,
  FaUser,
  FaSearch,
  FaHome,
  FaBoxOpen,
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useSearch } from '../context/SearchContext'
import { useStore } from '../context/StoreContext'
import '../css/Header.css'

function Header() {
  const { totalItemCount } = useStore()
  const { user, loading, isAdmin } = useAuth()
  const { busqueda, setBusqueda } = useSearch()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setExpanded(false)
    navigate('/productos')
  }

  function closeNav() {
    setExpanded(false)
  }

  return (
    <Navbar
      expand="lg"
      sticky="top"
      expanded={expanded}
      onToggle={setExpanded}
      className="header-navbar"
      bg="light"
      variant="light"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="header-navbar__brand" onClick={closeNav}>
          Talento Tech Store
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Form
            className="header-navbar__search d-flex my-3 my-lg-0 mx-lg-3 flex-grow-1"
            onSubmit={handleSearchSubmit}
            role="search"
          >
            <InputGroup>
              <InputGroup.Text aria-hidden>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Buscar productos…"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                aria-label="Buscar productos por nombre"
                autoComplete="off"
              />
            </InputGroup>
          </Form>

          <Nav className="ms-lg-auto align-items-lg-center gap-lg-1">
            <Nav.Link as={NavLink} to="/" end onClick={closeNav}>
              <FaHome className="me-1" aria-hidden />
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/productos" onClick={closeNav}>
              <FaBoxOpen className="me-1" aria-hidden />
              Productos
            </Nav.Link>
            <Nav.Link as={NavLink} to="/favoritos" onClick={closeNav}>
              <FaHeart className="me-1" aria-hidden />
              Favoritos
            </Nav.Link>
            {isAdmin ? (
              <>
                <Nav.Link as={NavLink} to="/admin/productos" onClick={closeNav}>
                  Admin
                </Nav.Link>
                <Nav.Link as={NavLink} to="/admin/cupones" onClick={closeNav}>
                  Cupones
                </Nav.Link>
              </>
            ) : null}
            <Nav.Link
              as={NavLink}
              to="/carrito"
              className="header-navbar__cart"
              onClick={closeNav}
            >
              <FaShoppingCart className="me-1" aria-hidden />
              Carrito
              {totalItemCount > 0 ? (
                <Badge bg="danger" pill className="ms-1">
                  {totalItemCount}
                </Badge>
              ) : null}
            </Nav.Link>
            <Nav.Link as={Link} to="/#contacto" onClick={closeNav}>
              Contacto
            </Nav.Link>
            {loading ? null : user ? (
              <Nav.Link as={NavLink} to="/perfil" onClick={closeNav}>
                <FaUser className="me-1" aria-hidden />
                Mi Perfil
              </Nav.Link>
            ) : (
              <Nav.Link as={NavLink} to="/login" onClick={closeNav}>
                <FaUser className="me-1" aria-hidden />
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
