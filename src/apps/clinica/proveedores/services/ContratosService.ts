import { apiClient } from "../../../../commons/services"

export const ContratosService = {
  registrar: (proveedorId: number, data: {
    inicio: string,
    fin: string,
    prestacion_ids: number[] 
  }) =>{
    return apiClient.post(`proveedores/${proveedorId}/contratos`,  data)
  }
}