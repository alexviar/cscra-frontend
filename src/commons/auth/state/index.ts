export type User = {
  id: number
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

export type LoginForm = {
  fields: {
    username: string,
    password: string
  }
  errors: {
    username: string,
    password: string
  },
  message: string
}