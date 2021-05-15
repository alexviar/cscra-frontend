import { apiClient } from "../../../../commons/services"

export type Permiso = string

export const PermisoService = {
  buscar: ()=>{
    return apiClient.get<Permiso[]>('/permisos')
  }
}