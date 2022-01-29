import { authClient, apiClient } from "../../../commons/services"

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
  roles: {
    id: number
    name: string
    permissions: {
      id: number
      name: string
    }[]
  }[]
  createdAt: string
  updatedAt: string
  regionalId: number
  regional: {
    id: number
    nombre: string
  }
}

export const AuthService = {
  login: async (username: string, password: string, remember_me: boolean) => {
    await authClient.get("sanctum/csrf-cookie")
    return await authClient.post<User>("login", {
      username,
      password,
      remember_me
    })
  },
  logout: () => {
    return authClient.post("logout")
  },
  fetch: () => {
    return apiClient.get<User>("user")
  }
}