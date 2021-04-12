import apiClient from "../../../../commons/services/apiClient"
import { Page } from "../../../../commons/services/Page"

type Especialidad = {
  id: number,
  nombre: string,
}
export const EspecialidadesService = {
  buscar: (page: Page, filter: string) => {
    return apiClient.get<{
      meta: {
        total: number
      },
      records: Especialidad[]
    }>("/especialidades", {
      params: {
        filter: {
          nombre: filter || undefined
        },
        page
      }
    })
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