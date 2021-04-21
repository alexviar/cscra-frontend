import { apiClient, PaginatedResponse, Page } from "../../../../commons/services"
import { apiEndpoint } from "../../../../configs/app.json"

export type SolicitudesAtencionExternaFilter = {
  id?: number,
  desde?: string,
  hasta?: string,
  matricula_asegurado?: string,
  doctor_id?: number,
  proveedor_id?: number
}

export type SolicitudAtencionExterna = {
  id: number,
  numero: number,
  fecha: string,
  matricula_asegurado: number,
  doctor: string,
  proveedor: string,
  urlDm11: string
}

export const SolicitudesAtencionExternaService = {
  buscar: (filter: SolicitudesAtencionExternaFilter, page: Page)=>{
    return apiClient.get<PaginatedResponse<SolicitudAtencionExterna>>("solicitudes-atencion-externa", {
      params: {filter, page}
    })
  },
  generarDm11: (solicitud_id: number) => {
    return apiClient.put<{url: string}>(`solicitudes-atencion-externa/${solicitud_id}/generar-dm11`)
  },
  registrar: (regional_id: number, asegurado_id: string, medico_id: number, proveedor_id: number, prestaciones_solicitadas: {prestacion_id: number, nota: string}[]) => {
    return apiClient.post("solicitudes-atencion-externa", {
      regional_id,
      asegurado_id,
      medico_id,
      proveedor_id,
      prestaciones_solicitadas
    })
  }
}