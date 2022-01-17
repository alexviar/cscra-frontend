import { apiClient, Page, PaginatedResponse } from "../../../../commons/services"
import axios, { AxiosPromise } from 'axios'
import { keysToUnderscore } from "../../../../commons/utils"

export type Empresa = {
  id: number
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
  id: number
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
  direccion: string
  ubicacion: {
    latitud: number,
    longitud: number
  } | null
  telefono1: number
  telefono2: number | null
}

export type Proveedor = (Empresa | Medico) & InformacionContacto

export type Filter = {
  tipos?: number[]
  nombre?: string
  _busqueda?: string
  regionalId?: number
  activos?: number
}


class ProveedorService {
  buscar(page: Page, filter?: Filter) {
    return apiClient.get<PaginatedResponse<Proveedor>>("proveedores", {
      params: keysToUnderscore({
        filter,
        page
      })
    })
  }
  cargar(id: number): AxiosPromise<Proveedor>{
    return apiClient.get(`proveedores/${id}`)
  }
  registrar(fields: Omit<Proveedor, "id" | "nombreCompleto" | "estado">): AxiosPromise<Proveedor> {
    return apiClient.post("proveedores", keysToUnderscore(fields))
  }
  actualizar({id, ...fields}: Omit<Proveedor, "nombreCompleto" | "estado">): AxiosPromise<Proveedor>{
    return apiClient.put(`proveedores/${id}`, keysToUnderscore(fields))
  }
}

export const ProveedoresService = new ProveedorService()