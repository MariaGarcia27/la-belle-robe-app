import api from './api'

export const createPago = async (data: unknown) => {
  const response = await api.post('/api/pagos', data)
  return response.data
}

export const getMisPagos = async () => {
  const response = await api.get('/api/pagos/mis-pagos')
  return response.data
}

export const getAllPagos = async () => {
  const response = await api.get('/api/pagos')
  return response.data
}