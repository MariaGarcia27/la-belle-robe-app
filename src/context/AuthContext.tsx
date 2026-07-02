import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  getProfile,
  login as loginRequest,
  registrarse,
  updateProfile as updateProfileRequest,
  type ActualizarPerfilPayload,
} from '@/api/authApi'

type Role = 'admin' | 'cliente'

type User = {
  _id: string
  nombre: string
  correo: string
  rol: Role
  telefono?: string
  direccion?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  login: (correo: string, password: string) => Promise<User>
  register: (nombre: string, correo: string, password: string) => Promise<void>
  updateUser: (payload: ActualizarPerfilPayload) => Promise<User>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token'),
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const login = async (correo: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const data = await loginRequest(correo, password)

      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))

      setToken(data.token)
      setUser(data.usuario)

      return data.usuario as User
    } catch {
      const message = 'Correo o contraseña incorrectos'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const register = async (nombre: string, correo: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      await registrarse(nombre, correo, password)
    } catch {
      const message = 'No se pudo crear la cuenta'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (payload: ActualizarPerfilPayload) => {
    const data = await updateProfileRequest(payload)
    const profile = data.usuario ?? data.user ?? data
    const merged = { ...user, ...profile } as User

    setUser(merged)
    localStorage.setItem('usuario', JSON.stringify(merged))

    return merged
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUser(null)
    setError(null)
  }

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token')

    if (!storedToken) {
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const data = await getProfile()
      const profile = data.usuario ?? data.user ?? data

      setToken(storedToken)
      setUser(profile)
      localStorage.setItem('usuario', JSON.stringify(profile))
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        updateUser,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}