import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { StoreProvider } from './context/StoreContext'
import CartPage from './pages/CartPage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'

function App() {
  return (
    <StoreProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/favoritos" element={<FavoritesPage />} />
        </Routes>
      </Layout>
    </StoreProvider>
  )
}

export default App
