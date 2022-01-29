import { apiClient, Page, PaginatedResponse } from "../../../../commons/services"
import axios, { AxiosPromise } from 'axios'
import { keysToUnderscore } from "../../../../commons/utils"

export type Empresa = {
  id: string
  tipo: 2
  nit: string
  nombre: string  
  estado: 1 | 2
  regionalId: number
  regional?: {
    id: number
    nombre: string
  }
}

export type Medico = {
  id: string
  tipo: 1
  nit: string
  ci: {
    raiz: number
    complemento: string | null
    texto?: string
  }
  nombre: string
  apellidoPaterno: string | null
  apellidoMaterno: string | null
  nombreCompleto: string
  especialidad: string  
  estado: 1 | 2
  regionalId: number
  regional?: {
    id: number
    nombre: string
  }
}

export type InformacionContacto = {
  razonSocial?: string
  direccion: string
  ubicacion: {
    latitud: number
    longitud: number
  } | null
  telefono1: number
  telefono2: number | null
}

export type Proveedor = (Empresa | Medico) & InformacionContacto

export type Filter = {
  tipo?: number
  _busqueda?: string
  regionalId?: number
  estado?: number
}


export const ProveedoresService = {
  buscar(page: Page, filter?: Filter) {
    return apiClient.get<PaginatedResponse<Proveedor>>("proveedores", {
      params: keysToUnderscore({
        filter,
        page
      })
    })
  },
  cargar(id: string): AxiosPromise<Proveedor>{
    return apiClient.get(`proveedores/${id}`)
  },
  registrar(fields: Omit<Proveedor, "id" | "nombreCompleto" | "estado">): AxiosPromise<Proveedor> {
    return apiClient.post("proveedores", keysToUnderscore(fields))
  },
  actualizar({id, ...fields}: Omit<Proveedor, "nombreCompleto" | "estado">): AxiosPromise<Proveedor>{
    return apiClient.put(`proveedores/${id}`, keysToUnderscore(fields))
  },
  actualizarEstado(id: string, estado: 1 | 2): AxiosPromise<Proveedor>{
    return apiClient.put(`proveedores/${id}/actualizar-estado`, keysToUnderscore({estado}))
  }
}