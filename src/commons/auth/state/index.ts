export type User = {
  id: number
  isGuest: boolean
  username: string
  estado: boolean
  ciRaiz: number
  ciComplemento: string
  ci: string
  apellidoPaterno: string
  apellidoMaterno: string
  nombres: string
  nombreCompleto: string
  allPermissions: {
    id: number
    name: string
  }[]
  roles: {
    id: number
    name: string
  }[]
  createdAt: string
  updatedAt: string
  regionalId: number
}