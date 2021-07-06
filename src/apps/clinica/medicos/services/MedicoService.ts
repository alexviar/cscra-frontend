import { apiClient, PaginatedResponse, Page } from "../../../../commons/services"
import { keysToUnderscore } from "../../../../commons/utils"

export type Medico = {
  id: number,
  tipo: number
  ci: {
    raiz: number,
    complemento: string,
  },
  ciText: string,
  apellidoPaterno: string,
  apellidoMaterno: string,
  nombres: string,
  nombreCompleto: string,
  sexo: string,
  especialidadId: number
  especialidad: string
  estado: number
  estadoText: string
  regionalId: number
  regional: string
}

export type MedicoFilter = {
  ci?: string,
  ciComplemento?: string
  nombre?: string,
  especialidadId?: number
  regionalId?: number
  estado?: number
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
  registrar: (tipo: number,
    ci: {
      raiz: number,
      complemento: string,
    }, apellido_paterno: string, apellido_materno: string, nombres: string, especialidad_id: number, regional_id: number) => {
    return apiClient.post<Medico>("medicos", {
      tipo,
      ci: ci.raiz,
      ci_complemento: ci.complemento,
      apellido_paterno,
      apellido_materno,
      nombres,
      especialidad_id,
      regional_id
    })
  },
  actualizar: (id: number, tipo: number,
    ci: {
      raiz: number,
      complemento: string,
    }, apellido_paterno: string, apellido_materno: string, nombres: string, especialidad_id: number, regional_id: number) => {
    return apiClient.put<Medico>(`medicos/${id}`, {
      tipo,
      ci: ci.raiz,
      ci_complemento: ci.complemento,
      apellido_paterno,
      apellido_materno,
      nombres,
      especialidad_id,
      regional_id
    })
  },
  cambiarEstado: (id: number, estado: number) => {
    return apiClient.put(`medicos/${id}/cambiar-estado`, {
      estado
    })
  }
}