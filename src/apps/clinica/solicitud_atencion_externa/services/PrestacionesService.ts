import axios from "axios";
import { apiClient } from "../../../../commons/services"

export type Prestacion = {
  id: number,
  nombre: string,
}

export const PrestacionesService = {
  buscarPorNombre: (nombre: string) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source()
  
    const promise = apiClient.get<Prestacion[]>("/especialidades/buscar-nombre", {
      params: {
        nombre
      }
    })
    //@ts-ignore
    promise.cancel = () => {
      source.cancel('Query was cancelled by React Query')
    }
    return promise
  }
}