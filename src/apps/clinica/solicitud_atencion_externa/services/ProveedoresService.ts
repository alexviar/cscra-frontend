import { apiClient, Page, PaginatedResponse } from "../../../../commons/services"
import axios from 'axios'
import { Medico } from "./MedicosService"

export type Empresa = {
  id: number,
  nombre: string
}

export type Proveedor = {
  id: number
  nombre: string
  medico?: Medico
  regionalId: number
  contrato: {
    prestaciones: {
      id: number
      nombre: string
    }[]
  }
}

export type Filter = {
  regionalId: number
}

export const ProveedorService = {
  buscar: (filter?: Filter, page?: Page) => {
    return apiClient.get<Proveedor[]>("proveedores", {
      params: {
        filter,
        page
      }
    })
  },
  buscarPorNombre: (nombre: string) =>{
    // Create a new CancelToken source for this request
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source()
  
    const promise = apiClient.get<Proveedor[]>("proveedores/buscar-nombre", {
      params: {nombre},
      cancelToken: source.token
    })
    // Cancel the request if React Query calls the `promise.cancel` method
    //@ts-ignore
    promise.cancel = () => {
      source.cancel('Query was cancelled by React Query')
    }
    return promise
  }
}