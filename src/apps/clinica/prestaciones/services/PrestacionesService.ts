import { apiClient, Page, PaginatedResponse } from "../../../../commons/services"

export type Prestacion = {
  id: number,
  nombre: string,
}

export const PrestacionesService = {
  buscar: (page: Page, filter: string) => {
    return apiClient.get<PaginatedResponse<Prestacion>>("/prestaciones", {
      params: {
        filter: {
          nombre: filter || undefined
        },
        page
      }
    })
  },
  ver: (id: number) => {
    return apiClient.get<Prestacion>(`prestaciones/${id}`)
  },
  registrar: (nombre: string) => {
    return apiClient.post<Prestacion>("prestaciones", {
      nombre
    })
  },
  actualizar: (id: number, nombre: string) => {
    return apiClient.put<Prestacion>(`prestaciones/${id}`, {
      nombre
    })
  },
  eliminar: (id: number) => {
    return apiClient.delete(`prestaciones/${id}`)
  },
  importar: (archivo: File, separador: string, formato: string) =>{
    const formData = new FormData()
    formData.append("archivo", archivo, archivo.name)
    formData.append("separador", separador)
    formData.append("formato", formato)
    return apiClient.post("/prestaciones/importar", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}