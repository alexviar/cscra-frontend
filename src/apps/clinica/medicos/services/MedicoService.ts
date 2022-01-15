import { apiClient, PaginatedResponse, Page } from "../../../../commons/services"
import { keysToUnderscore } from "../../../../commons/utils"

export type Medico = {
  id: number
  ci: {
    raiz: number
    complemento: string
    texto?: string
  },
  apellidoPaterno: string
  apellidoMaterno: string
  nombres: string
  nombreCompleto?: string
  especialidad: string
  estado: number
  regionalId: number
  regional?: {
    id: number
    nombre: string
  }
}

export type MedicoFilter = {
  ci?: string,
  ciComplemento?: string
  nombre?: string,
  especialidad?: string
  regionalId?: number
  estado?: number
}

export const MedicosService = {
  buscar: (page: Page, filter?: MedicoFilter) => {
    return apiClient.get<PaginatedResponse<Medico>>("medicos", {
      params: keysToUnderscore({
        filter,
        page
      })
    })
  },
  load: (id: number) => {
    return apiClient.get<Medico>(`medicos/${id!}`);
  },
  registrar: (medico: Omit<Medico, "id" | "estado">) => {
    return apiClient.post<Medico>("medicos", keysToUnderscore(medico))
  },
  actualizar: (medico: Omit<Medico, "estado">) => {
    return apiClient.put<Medico>(`medicos/${medico.id}`, keysToUnderscore(medico))
  },
  cambiarEstado: (id: number, estado: number) => {
    return apiClient.put(`medicos/${id}/cambiar-estado`, {
      estado
    })
  }
}