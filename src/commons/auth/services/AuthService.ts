import { authClient, apiClient } from "../../../commons/services"

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