import { useParams } from 'react-router-dom'

export function ProductPage() {
  const { id } = useParams()

  return <main className="p-8">Producto {id}</main>
}