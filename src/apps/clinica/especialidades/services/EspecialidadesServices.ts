import axios, { AxiosPromise } from "axios"
import { PaginatedResponse } from "../../../../commons/services"
import apiClient from "../../../../commons/services/apiClient"
import { Page } from "../../../../commons/services/Page"

export type Especialidad = {
  id: number,
  nombre: string,
}

interface EspecialidadesService {
  buscar(filter: string): AxiosPromise<Especialidad[]>
  buscar(filter: string, page: Page): AxiosPromise<PaginatedResponse<Especialidad>>
  ver: (id: number) => AxiosPromise<Especialidad>
  registrar: (nombre: string) => AxiosPromise<Especialidad>
  actualizar: (id: number, nombre: string) => AxiosPromise<Especialidad>
  eliminar: (id: number) => AxiosPromise<Especialidad>
  importar(archivo: File, separador: string, formato: string): AxiosPromise

}

export const EspecialidadesService: EspecialidadesService = {
  buscar: (filter: string, page?: Page) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source()
  
    const promise = apiClient.get("/especialidades", {
      params: {
        filter: {
          nombre: filter || undefined
        },
        page
      }
    })
    //@ts-ignore
    promise.cancel = () => {
      source.cancel('Query was cancelled by React Query')
    }
    return promise
  },
  ver: (id: number) => {
    return apiClient.get<Especialidad>(`especialidades/${id}`)
  },
  registrar: (nombre: string) => {
    return apiClient.post<Especialidad>("especialidades", {
      nombre
    })
  },
  actualizar: (id: number, nombre: string) => {
    return apiClient.put<Especialidad>(`especialidades/${id}`, {
      nombre
    })
  },
  eliminar: (id: number) => {
    return apiClient.delete(`especialidades/${id}`)
  },
  importar: (archivo: File, separador: string, formato: string) =>{
    const formData = new FormData()
    formData.append("archivo", archivo, archivo.name)
    formData.append("separador", separador)
    formData.append("formato", formato)
    return apiClient.post("/especialidades/importar", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}