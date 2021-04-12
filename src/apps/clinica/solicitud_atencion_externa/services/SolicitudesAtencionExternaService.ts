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
  url_dm11: string
}

export const SolicitudesAtencionExternaService = {
  buscar: (filter: SolicitudesAtencionExternaFilter, page: Page)=>{
    return apiClient.get<PaginatedResponse<SolicitudAtencionExterna>>("/solicitudes-atencion-externa", {
      params: {filter, page}
    })
  },
  generarDm11: (solicitud_id: number) => {
    return apiClient.put<{url: string}>(`/solicitudes-atencion-externa/${solicitud_id}/generar-dm11`)
  }
}