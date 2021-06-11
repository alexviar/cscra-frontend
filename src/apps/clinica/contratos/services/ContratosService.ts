import { apiClient, Page, PaginatedResponse } from "../../../../commons/services"
import { AxiosPromise } from 'axios'
import { keysToUnderscore } from "../../../../commons/utils"

export type Contrato = {
  id: number
  inicio: string
  fin: string
  extension: string
  estadoText: string
  prestaciones: {
    id: number
    nombre: string
  }[]  
}

export type Filter = {
  desde?: string
  hasta?: string
  estado?: number
}


class ContratoService {
  buscar(idProveedor: number, filter: {}, page: Page): AxiosPromise<PaginatedResponse<Contrato>>{
    return apiClient.get(`proveedores/${idProveedor}/contratos`, {
      params: keysToUnderscore({filter, page})
    })
  }
  ver(idProveedor: number, idContrato: number): AxiosPromise<Contrato>{
    return apiClient.get(`proveedores/${idProveedor}/contratos/${idContrato}`)
  }
  registrar(idProveedor: number, contrato: {
    inicio: string
    fin?: string
    prestacionIds: number[]
  }): AxiosPromise<Contrato>{
    return apiClient.post(`proveedores/${idProveedor}/contratos`, keysToUnderscore(contrato))
  }
  consumir(idProveedor: number, idContrato: number): AxiosPromise<Contrato>{
    return apiClient.put(`proveedores/${idProveedor}/contratos/${idContrato}/consumir`)
  }
  extender(idProveedor: number, idContrato: number): AxiosPromise<Contrato>{
    return apiClient.put(`proveedores/${idProveedor}/contratos/${idContrato}/extender`)
  }
  anular(idProveedor: number, idContrato: number): AxiosPromise<Contrato>{
    return apiClient.put(`proveedores/${idProveedor}/contratos/${idContrato}/anular`)
  }
}

export const ContratosService = new ContratoService()