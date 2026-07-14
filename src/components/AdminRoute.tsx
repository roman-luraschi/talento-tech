import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'
import type { ReactNode } from 'react'

interface AdminRouteProps {
  children: ReactNode
}

function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner label="Verificando permisos..." height="30vh" />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!isAdmin) {
    return <Navigate to="/perfil" replace />
  }

  return children
}

export default AdminRoute
