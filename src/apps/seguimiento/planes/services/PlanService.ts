import { apiClient, Page, PaginatedResponse } from "../../../../commons/services"
import { keysToUnderscore } from "../../../../commons/utils"

export type PlanFilter = {
  regionalId?: number
  creadoPor?: number
}

export type Avance = {
  id: number
  fecha: string
  actual: number
  esperado: number,
  informeUrl: string
  observaciones: string
}

export type Actividad = {
  id: number
  nombre: string
  inicio: string
  fin: string
  conclusion: string | null
  avance: number
  avanceEsperado: number
  indicadores: string
  estado: number
  historial: Avance[]
}

export type Plan = {
  id: number
  regionalId: number
  areaId: number
  objetivoGeneral: string
  avance: number
  avanceEsperado: number
  concluido: boolean
  actividades: Actividad[]
  usuarioId: number
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

  registrar(payload: {
    regionalId: number
    areaId: number
    objetivoGeneral: string
    actividades: {
      nombre: string
      indicadores: string
      inicio: string
      fin: string
    }[]
  }) {
    return apiClient.post('/planes', keysToUnderscore(payload))
  }
  
  cargarActividad(id: number, actividadId: number) {
    return apiClient.get<Actividad>(`/planes/${id}/actividades/${actividadId}`)
  }
  
  registrarAvance(id: number, actividadId: number, payload: {
    avance: number,
    informe: File,
    observaciones: string
  }) {
    const formData = new FormData()
    formData.append("avance", String(payload.avance))
    formData.append("observaciones", payload.observaciones)
    formData.append("informe", payload.informe)
    return apiClient.post<Avance>(`/planes/${id}/actividades/${actividadId}/avances`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export const PlanService = new Service()