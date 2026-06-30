import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '../components/ui/label'
type FormErrors = {
  correo?: string
  password?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPage() {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!correo.trim()) {
      newErrors.correo = 'El correo es obligatorio'
    } else if (!emailRegex.test(correo)) {
      newErrors.correo = 'Ingresa un correo válido'
    }

    if (!password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener mínimo 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) return

    try {
      const usuario = await login(correo, password)

      toast.success('Inicio de sesión exitoso')

      if (usuario.rol === 'admin') {
        navigate('/admin')
      } else {
        navigate('/catalogo')
      }
    } catch {
      toast.error('No se pudo iniciar sesión')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-pink-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Accede a tu cuenta de La Belle Robe.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="correo">Correo</Label>
              <Input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="cliente@labellerobe.com"
              />
              {errors.correo && (
                <p className="text-sm text-red-500">{errors.correo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link className="font-medium text-pink-600" to="/register">
                Regístrate
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}