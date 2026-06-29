import api from './api'

export const createPedido = async (data: unknown) => {
  const response = await api.post('/api/pedidos', data)
  return response.data
}

export const getAllPedidos = async () => {
  const response = await api.get('/api/pedidos')
  return response.data
}

export const getMisPedidos = async () => {
  const response = await api.get('/api/pedidos/mis-pedidos')
  return response.data
}

export const updateEstado = async (id: string, estado: string) => {
  const response = await api.put(`/api/pedidos/${id}/estado`, {
    estado,
  })

  return response.data
}