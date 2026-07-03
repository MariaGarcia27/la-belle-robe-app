import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Logo } from '@/components/shared'

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
  const [showPassword, setShowPassword] = useState(false)
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
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Panel izquierdo decorativo */}
      <div className="relative hidden items-center justify-center bg-linear-to-br from-primary via-primary/70 to-secondary md:flex md:w-1/2">
      <div className="max-w-md px-12 text-center">
        {/* Corrección para que el Logo y sus elementos sean oscuros */}
        <Logo className="justify-center [&_span:last-child]:text-current [&_span:first-child]:bg-black/10 [&_.lucide-flower2]:text-current text-primary-dark" />
        
        {/* Corrección de color en el H1 (text-primary-dark para un tono oscuro) */}
        <h1 className="mt-10 font-serif text-4xl font-semibold leading-tight text-primary-dark text-balance">
          Viste lo que sientes
        </h1>
        
        {/* Corrección de color en el P (text-primary-dark/90 para un tono oscuro con opacidad) */}
        <p className="mt-4 leading-relaxed text-primary-dark/90">
          Descubre piezas femeninas, elegantes y atemporales pensadas para
          realzar tu estilo único.
        </p>
      </div>
    </div>

      {/* Panel derecho con formulario */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12">
        <Card className="w-full max-w-md border-border p-8 shadow-sm">
          <div className="mb-6 flex flex-col items-center text-center md:hidden">
            <Logo />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Bienvenida de nuevo
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa a tu cuenta para continuar comprando.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="correo">Correo electrónico</Label>
              <Input
                id="correo"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              {errors.correo && (
                <p className="text-sm text-red-500">{errors.correo}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Entrar'}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-[#f06292]">
              Regístrate
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}