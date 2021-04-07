import apiClient from "../../../commons/services/apiClient"
import { Page } from "../../../commons/services/Page"

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
  fetch: (page: Page, filter: ListaMoraFilter)=>{
    return apiClient.get<{records: ListaMoraItem[]}>("/lista-mora", {
      params: {
        page, filter: {
          numero_patronal: filter.numeroPatronal,
          nombre: filter.nombre,
          nit: filter.nit,
          regional_id: filter.regionalId
        }
      }
    })
  },
  agregar: (idEmpleador: number) =>{
    return apiClient.post<ListaMoraItem>("/lista-mora/agregar", {
      empleador_id: idEmpleador
    })
  },
  quitar: (idEmpleador: number) =>{
    return apiClient.post<ListaMoraItem>("/lista-mora/quitar", {
      empleador_id: idEmpleador
    })
  }
}

export * from './EmpleadorService'