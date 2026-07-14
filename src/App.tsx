import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import LoadingSpinner from './components/LoadingSpinner'
import { AuthProvider } from './context/AuthContext'
import { ProductsProvider } from './context/ProductsContext'
import { SearchProvider } from './context/SearchContext'
import { StoreProvider } from './context/StoreContext'
import CartPage from './pages/CartPage'
import FavoritesPage from './pages/FavoritesPage'
import Inicio from './pages/Inicio.jsx'
import LoginPage from './pages/LoginPage'
import Perfil from './pages/Perfil.jsx'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductsPage from './pages/ProductsPage'

const AdminProductosPage = lazy(() => import('./pages/AdminProductosPage'))
const GestionCupones = lazy(() => import('./components/GestionCupones.jsx'))

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <StoreProvider>
          <SearchProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/productos" element={<ProductsPage />} />
                <Route path="/producto/:id" element={<ProductDetailPage />} />
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/favoritos" element={<FavoritesPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <Perfil />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/productos"
                  element={
                    <AdminRoute>
                      <Suspense fallback={<LoadingSpinner label="Cargando panel…" />}>
                        <AdminProductosPage />
                      </Suspense>
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/cupones"
                  element={
                    <AdminRoute>
                      <Suspense fallback={<LoadingSpinner label="Cargando cupones…" />}>
                        <GestionCupones />
                      </Suspense>
                    </AdminRoute>
                  }
                />
              </Routes>
            </Layout>
          </SearchProvider>
        </StoreProvider>
      </ProductsProvider>
    </AuthProvider>
  )
}

export default App
