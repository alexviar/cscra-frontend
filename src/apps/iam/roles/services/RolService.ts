import { apiClient, Page, PaginatedResponse } from "../../../../commons/services"
import { Permiso } from "./PermisoService"

export type RolFilter = {
  _busqueda?: string,
}

export type Rol = {
  id: number,
  name: string,
  description: string,
  permissions: {id: number, name: string}[]
  createdAt: string
  updatedAt: string
}

export const RolService = {
  buscar: (filter?: RolFilter, page?: Page)=>{
    return apiClient.get<PaginatedResponse<Rol>|Rol[]>('/roles', {
      params: { filter, page }
    })
  },
  cargar: (id: number)=>{
    return apiClient.get<Rol>(`/roles/${id}`)
  },
  registrar: (data: {
    name: string,
    description: string,
    permissions: string[]
  }) => {
    return apiClient.post<Rol>('roles', data)
  },
  actualizar: (id: number, data: {
    name: string,
    description: string,
    permissions: string[]
  }) => {
    return apiClient.put<Rol>(`roles/${id}`, data)
  },
  eliminar: (id: number) => {
    return apiClient.delete(`roles/${id}`)
  }
}