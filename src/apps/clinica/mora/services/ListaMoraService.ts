import { apiClient, Page, PaginatedResponse} from "../../../../commons/services"
import { keysToUnderscore } from "../../../../commons/utils"

export type ListaMoraFilter = {
  _busqueda?: string,
  numeroPatronal?: string,
  nombre?: string,
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
    return apiClient.post<ListaMoraItem>("lista-mora", {
      empleador_id: idEmpleador
    })
  },
  quitar: (id: number) =>{
    return apiClient.delete(`lista-mora/${id}`)
  }
}