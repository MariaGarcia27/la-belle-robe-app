import api from './api'

export const login = async (correo: string, contraseña: string) => {
  const response = await api.post('/api/auth/login', {
    correo,
    contraseña,
  })

  return response.data
}

export const registrarse = async (
  nombre: string,
  correo: string,
  contraseña: string,
) => {
  const response = await api.post('/api/auth/register', {
    nombre,
    correo,
    contraseña,
  })

  return response.data
}

export const getProfile = async () => {
  const response = await api.get('/api/auth/profile')
  return response.data
}

export const getUsuarios = async () => {
  const response = await api.get('/api/auth/usuarios')
  return response.data
}