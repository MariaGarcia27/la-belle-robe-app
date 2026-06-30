import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type PublicRouteProps = {
  children: ReactNode
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="text-gray-600">Cargando...</p>
      </main>
    )
  }

  if (user?.rol === 'admin') {
    return <Navigate to="/admin" replace />
  }

  if (user?.rol === 'cliente') {
    return <Navigate to="/catalogo" replace />
  }

  return children
}