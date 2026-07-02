import api from './api'

export const login = async (correo: string, password: string) => {
  const response = await api.post('/api/auth/login', {
    correo,
    password,
  })

  return response.data
}

export const registrarse = async (
  nombre: string,
  correo: string,
  password: string,
) => {
  const response = await api.post('/api/auth/register', {
    nombre,
    correo,
    password,
  })

  return response.data
}

export const getProfile = async () => {
  const response = await api.get('/api/auth/profile')
  return response.data
}

export type ActualizarPerfilPayload = Partial<{
  nombre: string
  correo: string
  telefono: string
  direccion: string
  password: string
}>

export const updateProfile = async (payload: ActualizarPerfilPayload) => {
  const response = await api.put('/api/auth/profile', payload)
  return response.data
}

export const getUsuarios = async () => {
  const response = await api.get('/api/auth/usuarios')
  return response.data
}