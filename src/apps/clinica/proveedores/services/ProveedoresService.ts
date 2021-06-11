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
  tipoId: number
  tipo: string  
  nit: number | null

  nombre: string | null

  ci: number,
  ciComplemento: string,
  ciText: string,
  apellidoPaterno: string,
  apellidoMaterno: string,
  nombres: string,
  nombreCompleto: string,
  
  regionalId: number
  regional: {
    id: number
    nombre: string
  }
  sexo: string,
  especialidadId: number,
  especialidad: {
    id: number,
    nombre: string
  }

  municipioId: number
  municipio: { 
    id: number
    nombre: string
    provincia: { 
      id: number
      nombre: string
      departamento: { 
        id: number
        nombre: string
      }
    }
  }
  direccion: string
  ubicacion: {
    latitud: number,
    longitud: number
  }
  telefono1: number
  telefono2: number | null

  contrato: {
    inicio: string
    fin: string
    extension: string
    estadoText: string
    prestaciones: {
      id: number
      nombre: string
    }[]
  }
}

export type Contrato = {
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
  regionalId?: number
  activos?: number
}


class ProveedorService {
  buscar(filter: Filter): AxiosPromise<Proveedor[]>;
  buscar(filter: Filter, page: Page): AxiosPromise<PaginatedResponse<Proveedor>>;
  buscar(filter: Filter, page?: Page) {
    return apiClient.get("proveedores", {
      params: {
        filter,
        page
      }
    })
  }
  cargar(id: number): AxiosPromise<Proveedor>{
    return apiClient.get(`proveedores/${id}`)
  }
  registrar(fields: {
    general: {
      tipoId: 1,
      nit?: number,
      ci: number,
      ciComplemento?: string
      apellidoPaterno?: string
      apellidoMaterno?: string
      nombres: string
      especialidadId: number
    } | {
      tipoId: 2,
      nit?: number,
      nombre: string,
    },
    contacto?: {
      municipioId: number,
      direccion: string,
      ubicacion: {
        latitud: number,
        longitud: number
      },
      telefono1: number,
      telefono2?: number
    },
    contrato: {
      inicio: string,
      fin: string,
      prestacionIds: number[] 
    }
  }): AxiosPromise<Proveedor> {
    return apiClient.post("proveedores", keysToUnderscore(fields))
  }
  actualizar(id: number, fields: {
    tipoId: 1,
    nit?: number,
    ci: number,
    ciComplemento?: string
    apellidoPaterno?: string
    apellidoMaterno?: string
    nombres: string
    especialidadId: number
    regionalId: number
  } | {
    tipoId: 2,
    nit?: number,
    nombre: string,
    regionalId: number
  }): AxiosPromise<Proveedor>{
    return apiClient.put(`proveedores/${id}`, keysToUnderscore(fields))
  }
  actualizarInformacionDeContacto(id: number, infoContacto: {
    municipioId: number,
    direccion: string,
    ubicacion: {
      latitud: number,
      longitud: number
    },
    telefono1: number,
    telefono2?: number
  }): AxiosPromise<Proveedor>{
    return apiClient.put(`proveedores/${id}/contacto`, keysToUnderscore(infoContacto))
  }
}

export const ProveedoresService = new ProveedorService()