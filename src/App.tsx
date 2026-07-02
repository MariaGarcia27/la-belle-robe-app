import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { CatalogPage } from './pages/CatalogPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { OrdersPage } from './pages/OrdersPage'
import { ProfilePage } from './pages/ProfilePage'
import { AdminDashboard } from './pages/admin/AdminDashboardPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { PublicRoute } from './routes/PublicRoute'
import { ClientNavbar } from './components/ClientNavbar'
import { AdminProfilePage } from './pages/admin/AdminProfilePage'

// Layout que envuelve todas las rutas privadas del cliente con el navbar
function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClientNavbar />
      <main>{children}</main>
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rutas públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Rutas privadas cliente — con ClientNavbar */}
      <Route
        path="/catalogo"
        element={
          <ProtectedRoute>
            <ClientLayout>
              <CatalogPage />
            </ClientLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/producto/:id"
        element={
          <ProtectedRoute>
            <ClientLayout>
              <ProductPage />
            </ClientLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/carrito"
        element={
          <ProtectedRoute>
            <ClientLayout>
              <CartPage />
            </ClientLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <ClientLayout>
              <CheckoutPage />
            </ClientLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/confirmacion"
        element={
          <ProtectedRoute>
            <ClientLayout>
              <ConfirmationPage />
            </ClientLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pedidos"
        element={
          <ProtectedRoute>
            <ClientLayout>
              <OrdersPage />
            </ClientLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <ClientLayout>
              <ProfilePage />
            </ClientLayout>
          </ProtectedRoute>
        }
      />

      {/* Rutas privadas admin — sin ClientNavbar */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminProductsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pedidos"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/clientes"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCustomersPage />
          </ProtectedRoute>
        }
      />
      <Route
      path="/admin/perfil"
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminProfilePage />
        </ProtectedRoute>
      }
    />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App