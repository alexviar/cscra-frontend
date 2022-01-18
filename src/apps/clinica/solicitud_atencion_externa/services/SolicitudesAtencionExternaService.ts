import { apiClient, PaginatedResponse, Page } from "../../../../commons/services"
import { keysToUnderscore } from "../../../../commons/utils"

export type SolicitudesAtencionExternaFilter = {
  numero?: number
  desde?: string
  hasta?: string
  numeroPatronal?: string
  matriculaAsegurado?: string
  medico?: string
  proveedor?: string
  regionalId?: number
  registradoPor?: number
}

export type SolicitudAtencionExterna = {
  id: number
  numero: string
  fecha: string
  regionalId: number
  asegurado: {
    matricula: string
  },
  medico: {
    id: number
    nombreCompleto?: string
    especialidad: string
  },
  proveedor: {
    id: string
    tipo: 2
    nombre: string
  } | {
    id: string,
    tipo: 1
    nombreCompleto?: string
  },
  regional: {
    id: number
    nombre: string
  }
  urlDm11: string
}

export const SolicitudesAtencionExternaService = {
  buscar: (filter: SolicitudesAtencionExternaFilter, page: Page)=>{
    return apiClient.get<PaginatedResponse<SolicitudAtencionExterna>>("solicitudes-atencion-externa", {
      params: keysToUnderscore({filter, page})
    })
  },
  generarDm11: (solicitud_id: number) => {
    return apiClient.put<{url: string}>(`solicitudes-atencion-externa/${solicitud_id}/generar-dm11`)
  },
  registrar: (regional_id: number, asegurado_id: string, medico_id: number, proveedor_id: string, prestacion: string) => {
    return apiClient.post("solicitudes-atencion-externa", {
      regional_id,
      asegurado_id,
      medico_id,
      proveedor_id,
      prestacion
    })
  }
}