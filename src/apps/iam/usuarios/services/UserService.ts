import { apiClient, Page, PaginatedResponse } from "../../../../commons/services"
import { keysToUnderscore } from "../../../../commons/utils"
import { Rol } from "../../roles/services"

export type UserFilter = {
  ci?: string
  ciComplemento?: string
  nombreCompleto?: string
  username?: string
  estado?: boolean
  regionalId?: number
}

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
  roles: Rol[]
  // roleNames: string[]
  regionalId: number
  createdAt: string
  updatedAt: string
}

export const UserService = {
  buscar: (filter: UserFilter, page: Page)=>{
    return apiClient.get<PaginatedResponse<User>>('/usuarios', {
      params: keysToUnderscore({
        page,
        filter
      })
    })
  },
  cargar: (userId: number) =>{
    return apiClient.get<User>(`/usuarios/${userId}`)
  },
  registrar: (data: {
    username: string
    password: string
    regionalId: number,
    roles: string[]
    ci: number
    ciComplemento: string
    apellidoPaterno: string
    apellidoMaterno: string
    nombres: string
  }) => {
    return apiClient.post('/usuarios', keysToUnderscore(data))
  },
  actualizar: (id: number, data: {
    regionalId: number,
    roles: string[]
    ci: number
    ciComplemento: string
    apellidoPaterno: string
    apellidoMaterno: string
    nombres: string
  }) => {
    return apiClient.put(`/usuarios/${id}`, keysToUnderscore(data))
  },
  cambiarContrasena: (id: number, data: {oldPassword?: string, password: string}) => {
    return apiClient.put(`/usuarios/${id}/cambiar-contrasena`, keysToUnderscore(data))
  },
  bloquear: (id: number) => {
    return apiClient.put(`/usuarios/${id}/bloquear`)
  },
  desbloquear: (id: number) => {
    return apiClient.put(`/usuarios/${id}/desbloquear`)
  }
}
