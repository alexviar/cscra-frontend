import { apiClient, Page, PaginatedResponse } from "../../../../commons/services"
import { keysToUnderscore } from "../../../../commons/utils"
import { Rol } from "../../roles/services"

export type UserFilter = {
  _busqueda?: string
  ci?: {
    raiz: number
    complemento?: string
  }
  nombreCompleto?: string
  username?: string
  estado?: number
  regionalId?: number
}

export type User = {
  id: number
  username: string
  estado: number
  ci: {
    raiz: number
    complemento: string
    texto?: string
  }
  apellidoPaterno: string
  apellidoMaterno: string
  nombre: string
  nombreCompleto: string
  roles: Rol[]
  // roleNames: string[]
  regionalId: number
  regional: {
    id: number
    nombre: string
  }
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
    ci: {
      raiz: number,
      complemento: string | null
    }
    apellidoPaterno: string
    apellidoMaterno: string
    nombre: string
  }) => {
    return apiClient.post('/usuarios', keysToUnderscore(data))
  },
  actualizar: (id: number, data: {
    regionalId: number,
    roles: string[]
    ci: {
      raiz: number,
      complemento: string | null
    }
    apellidoPaterno: string
    apellidoMaterno: string
    nombre: string
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
