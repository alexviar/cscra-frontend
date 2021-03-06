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
  empleadorId: number,
  numeroPatronal: string,
  nombre: string
}

export const ListaMoraService = {
  buscar: (filter: ListaMoraFilter, page: Page)=>{
    return apiClient.get<PaginatedResponse<ListaMoraItem>>("/lista-mora", {
      params: keysToUnderscore({
        page, filter
      })
    })
  },
  agregar: (idEmpleador: number) =>{
    return apiClient.post<ListaMoraItem>("lista-mora/agregar", {
      empleador_id: idEmpleador
    })
  },
  quitar: (idEmpleador: number) =>{
    console.log(idEmpleador)
    return apiClient.post<ListaMoraItem>("lista-mora/quitar", {
      empleador_id: idEmpleador
    })
  }
}