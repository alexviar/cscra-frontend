import { apiClient, PaginatedResponse } from "../../../../commons/services"
import axios from 'axios'

export type Medico = {
  id: number,
  apellidoPaterno: string | null,
  apellidoMaterno: string,
  nombres: string,
  especialidad: string
}

export const MedicosService = {
  buscarPorNombre: (nombre: string) =>{
    // Create a new CancelToken source for this request
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source()
  
    const promise = apiClient.get<PaginatedResponse<Medico>>("medicos", {
      params: {
        filter: {
          nombre_completo: nombre || undefined,
        },
        page: {
          current: 1,
          size: 10
        }
      },
      cancelToken: source.token
    })
    // Cancel the request if React Query calls the `promise.cancel` method
    //@ts-ignore
    promise.cancel = () => {
      source.cancel('Query was cancelled by React Query')
    }
    return promise
  }
}