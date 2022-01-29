import { apiClient, PaginatedResponse, Page } from "../../../../commons/services"
import { keysToUnderscore } from "../../../../commons/utils"

export type SolicitudesAtencionExternaFilter = {
  desde?: string
  hasta?: string
  numeroPatronal?: string
  matricula?: string
  medicoId?: number
  proveedorId?: string
  regionalId?: number
}

export type SolicitudAtencionExterna = {
  id: number
  numero: string
  fecha: string
  prestacion: string,
  regionalId: number
  paciente: {
    matricula: string
    nombreCompleto: string
  }
  titular: {
    matricula: string
    nombreCompleto: string
  } | null
  medico: {
    id: number
    nombreCompleto?: string
    especialidad: string
  },
  proveedor: {
    id: string
    razonSocial: string
  } & ({ 
    tipo: 1
    especialidad: string
  } | {
    tipo:2
  }),
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
  registrar: (regional_id: number, paciente_id: string, medico_id: number, proveedor_id: string, prestacion: string) => {
    return apiClient.post("solicitudes-atencion-externa", {
      regional_id,
      paciente_id,
      medico_id,
      proveedor_id,
      prestacion
    })
  }
}