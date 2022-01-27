import { apiClient, Page, PaginatedResponse} from "../../../../commons/services"
import { keysToUnderscore } from "../../../../commons/utils"

export type ListaMoraFilter = {
  numeroPatronal?: string,
  nombre?: string,
  nit?: number,
  regionalId?: number
}

export type ListaMoraItem = {
  id: number,
  empleadorId: string
  numeroPatronal: string
  nombre: string
  regionalId: number
  regional?: {
    id: number
    nombre: string
  }
}

export const ListaMoraService = {
  buscar: (filter: ListaMoraFilter, page: Page)=>{
    return apiClient.get<PaginatedResponse<ListaMoraItem>>("/lista-mora", {
      params: keysToUnderscore({
        page, filter
      })
    })
  },
  agregar: (idEmpleador: string) =>{
    return apiClient.post<ListaMoraItem>("lista-mora/agregar", {
      empleador_id: idEmpleador
    })
  },
  quitar: (idEmpleador: string) =>{
    return apiClient.post<ListaMoraItem>("lista-mora/quitar", {
      empleador_id: idEmpleador
    })
  }
}