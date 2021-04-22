import axios from "axios";
import { apiClient, Page, PaginatedResponse } from "../../../../commons/services"

export type Prestacion = {
  id: number,
  nombre: string,
}

export const PrestacionesService = {
  buscarPorNombre: (nombre: string) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source()
  
    const promise = apiClient.get<Prestacion[]>("/prestaciones/buscar-nombre", {
      params: {
        nombre
      }
    })
    //@ts-ignore
    promise.cancel = () => {
      source.cancel('Query was cancelled by React Query')
    }
    return promise
  },
  buscar: (filter: {nombre?: string}, page: Page) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source()
  
    const promise = apiClient.get<PaginatedResponse<Prestacion>>("prestaciones", {
      params: {
        filter, page
      }
    })
    //@ts-ignore
    promise.cancel = () => {
      source.cancel('Query was cancelled by React Query')
    }
    return promise
  }
}