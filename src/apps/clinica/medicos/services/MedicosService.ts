import { apiClient, PaginatedResponse, Page } from "../../../../commons/services"
import { keysToUnderscore } from "../../../../commons/utils"

export type Medico = {
  id: number,
  ci: {
    raiz: number,
    complemento: string,
  },
  apellidoPaterno: string,
  apellidoMaterno: string,
  nombres: string,
  nombreCompleto: string,
  sexo: string,
  especialidadId: number
  especialidad: string
  regionalId: number
}

export type MedicoFilter = {
  ci?: string,
  nombre?: string,
  especialidadId?: number
  regionalId?: number
  tipo?: number
}

export const MedicosService = {
  buscar: (filter?: MedicoFilter, page?: Page) => {
    return apiClient.get<PaginatedResponse<Medico> | Medico[]>("medicos", {
      params: keysToUnderscore({
        filter,
        page
      })
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