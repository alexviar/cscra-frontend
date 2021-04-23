import { apiClient, PaginatedResponse, Page } from "../../../../commons/services"

export type Medico = {
  id: number,
  ci: {
    raiz: number,
    complemento: string,
  },
  apellidoPaterno: string,
  apellidoMaterno: string,
  nombres: string,
  especialidadId: number
  especialidad: string
  regionalId: number
}

export type Filter = {
  ci?: string,
  nombre?: string,
  especialidadId?: number
  regionalId?: number
}

export const MedicosService = {
  buscar: (filter: Filter, page: Page) => {
    return apiClient.get<PaginatedResponse<Medico>>("medicos", {
      params:{
        filter,
        page
      }
    })
  },
  load: (id: number) => {
    return apiClient.get<Medico>(`medicos/${id!}`);
  },
  registrar: (ci: {
    raiz: number,
    complemento: string,
  }, apellido_paterno: string, apellido_materno: string, nombres: string, especialidad_id: number, regional_id: number) => {
    return apiClient.post<Medico>("medicos", {
      ci: ci.raiz,
      ci_complemento: ci.complemento,
      apellido_paterno,
      apellido_materno,
      nombres,
      especialidad_id,
      regional_id
    })
  },
  actualizar: (id: number, ci: {
    raiz: number,
    complemento: string,
  }, apellido_paterno: string, apellido_materno: string, nombres: string, especialidad_id: number, regional_id: number) => {
    return apiClient.put<Medico>(`medicos/${id}`, {
      ci: ci.raiz,
      ci_complemento: ci.complemento,
      apellido_paterno,
      apellido_materno,
      nombres,
      especialidad_id,
      regional_id
    })
  },
  eliminar: (id: number) => {
    return apiClient.delete(`medicos/${id!}`)
  }
}