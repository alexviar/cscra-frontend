import { apiClient, Page, PaginatedResponse } from "../../../../commons/services"
import { keysToUnderscore } from "../../../../commons/utils"

export type PlanFilter = {
  regionalId?: number
}

export type Avance = {
  id: number
  fecha: string
  avanceEsperado: number,
  avanceReal: number
  informe: string
  observaciones: string
}

export type Actividad = {
  id: number
  nombre: string
  inicio: string
  fin: string
  avance: number
  avanceEsperado: number
  indicadores: string
  estado: number
  historial: Avance[]
}

export type Plan = {
  id: number
  objetivoGeneral: string
  concluido: boolean
  actividades: Actividad[]
}

class Service {
  buscar(filter: PlanFilter, page: Page) {
    return apiClient.get<PaginatedResponse<Plan>>('/planes', {
      params: keysToUnderscore({
        page,
        filter
      })
    })
  }

  cargar(id: number) {
    return apiClient.get<Plan>(`/planes/${id}`)
  }
}

export const PlanService = new Service()