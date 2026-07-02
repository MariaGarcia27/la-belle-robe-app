import api from './api'

export const getProductos = async () => {
  const response = await api.get('/api/productos')
  return response.data
}

export const getProductoById = async (id: string) => {
  const response = await api.get(`/api/productos/${id}`)
  return response.data
}

export const createProducto = async (data: unknown) => {
  const response = await api.post('/api/productos', data)
  return response.data
}

export const updateProducto = async (id: string, data: unknown) => {
  const response = await api.put(`/api/productos/${id}`, data)
  return response.data
}

export const deleteProducto = async (id: string) => {
  const response = await api.delete(`/api/productos/${id}`)
  return response.data
}