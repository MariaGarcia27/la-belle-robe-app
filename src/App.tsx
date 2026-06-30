import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Button } from './components/ui/button'
import { useAuth } from './context/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function HomePage() {
  return <Navigate to="/login" replace />
}

function AdminPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-pink-50 p-8">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">Panel admin</h1>
        <p className="mt-2 text-gray-600">
          Bienvenida, {user?.nombre}. Rol: {user?.rol}
        </p>
        <Button className="mt-4" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </main>
  )
}

function CatalogoPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-pink-50 p-8">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">Catálogo</h1>
        <p className="mt-2 text-gray-600">
          Bienvenida, {user?.nombre}. Rol: {user?.rol}
        </p>
        <Button className="mt-4" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-pink-50 px-4">
      <div className="rounded-lg bg-white p-6 text-center shadow">
        <h1 className="text-2xl font-bold">Página no encontrada</h1>
        <Link className="mt-4 inline-block text-pink-600" to="/login">
          Volver al login
        </Link>
      </div>
    </main>
  )
}

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-pink-50">
        <p className="text-gray-600">Cargando...</p>
      </main>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/catalogo" element={<CatalogoPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App