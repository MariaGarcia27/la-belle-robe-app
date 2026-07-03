import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

type FormErrors = {
  nombre?: string
  correo?: string
  password?: string
  confirmarPassword?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio'
    }

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

    if (!confirmarPassword) {
      newErrors.confirmarPassword = 'Confirma tu contraseña'
    } else if (password !== confirmarPassword) {
      newErrors.confirmarPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) return

    try {
      await register(nombre, correo, password)

      toast.success('Cuenta creada correctamente')
      navigate('/login')
    } catch (err: any) {
      toast.error(err?.message ?? 'No se pudo crear la cuenta')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-pink-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>
            Regístrate para comprar en La Belle Robe.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                placeholder="María García"
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo</Label>
              <Input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="correo@ejemplo.com"
              />
              {errors.correo && (
                <p className="text-sm text-red-500">{errors.correo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarPassword">Confirmar contraseña</Label>

              <div className="relative">
                <Input
                  id="confirmarPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmarPassword}
                  onChange={(event) => setConfirmarPassword(event.target.value)}
                  placeholder="Repite tu contraseña"
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  aria-label={
                    showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {errors.confirmarPassword && (
                <p className="text-sm text-red-500">{errors.confirmarPassword}</p>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link className="font-medium text-pink-600" to="/login">
                Inicia sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}