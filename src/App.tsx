import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { StoreProvider } from './context/StoreContext'
import CartPage from './pages/CartPage'
import FavoritesPage from './pages/FavoritesPage'
import Inicio from './pages/Inicio.jsx'
import ProductDetailPage from './pages/ProductDetailPage'

function App() {
  return (
    <StoreProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
        </Routes>
      </Layout>
    </StoreProvider>
  )
}

export default App
