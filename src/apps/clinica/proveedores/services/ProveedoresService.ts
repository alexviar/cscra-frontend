import { apiClient, Page, PaginatedResponse } from "../../../../commons/services"
import axios, { AxiosPromise } from 'axios'
import { Medico } from "../../medicos/services"
import { keysToUnderscore } from "../../../../commons/utils"

export type Empresa = {
  id: number,
  nombre: string
}

export type Proveedor = {
  id: number
  nit: number|null
  nombre: string|null
  medico?: Medico
  tipoId: number
  tipo: string
  regionalId: number
  contrato: {
    inicio: string
    fin: string
    tipoId: number
    tipo: string
    prestaciones: {
      id: number
      nombre: string
    }[]
  }
}

export type Filter = {
  regionalId?: number
}


interface IProveedorService {
  buscar(filter: Filter): AxiosPromise<Proveedor[]>
  buscar(filter: Filter, page: Page): AxiosPromise<PaginatedResponse<Proveedor>>
  cargar(id: number): AxiosPromise<Proveedor>
  registrar(fields: {
    tipoId: 1,
    nit?: number,
    ci: string,
    ciComplemento: string
    apellidoPaterno: string
    apellidoMaterno: string
    nombres: string
    especialidadId: number
    regionalId: number
  } | {
    tipoId: 2,
    nit?: number,
    nombre: string,
    regionalId: number
  }): AxiosPromise<Proveedor>
  actualizar(id: number, fields: {
    tipoId: 1,
    nit?: number,
    ci: string,
    ciComplemento: string
    apellidoPaterno: string
    apellidoMaterno: string
    nombres: string
    especialidadId: number
    regionalId: number
  } | {
    tipoId: 2,
    nit?: number,
    nombre: string,
    regionalId: number
  }): AxiosPromise<Proveedor>
  eliminar(id: number): AxiosPromise

  [key: string]: any
}

export const ProveedoresService: IProveedorService = {
  // buscar(filter: Filter): AxiosPromise<Proveedor[]>
  // buscar(filter: Filter, page: Page): AxiosPromise<PaginatedResponse<Proveedor>>
  buscar: (filter: Filter, page?: Page) => {
    return apiClient.get("proveedores", {
      params: {
        filter,
        page
      }
    })
  },
  cargar: (id) => {
    return apiClient.get(`proveedores/${id}`)
  },
  registrar: (fields) => {
    return apiClient.post("proveedores", keysToUnderscore(fields))
  },
  actualizar: (id, fields) =>{
    return apiClient.put(`proveedores/${id}`, keysToUnderscore(fields))
  },
  eliminar: (id: number) => {
    return apiClient.get(`proveedores/${id}`)
  },
  actualizarInformacionDeContacto(id: number, infoContacto: {
    municipioId: number,
    direccion: string,
    ubicacion: {
      latitud: number,
      longitud: number
    },
    telefono1: number,
    telefono2?: number
  }){
    return apiClient.put(`proveedores/${id}/contacto`, keysToUnderscore(infoContacto))
  }

}