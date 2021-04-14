import { apiClient, PaginatedResponse } from "../../../../commons/services"

export type Asegurado = {
  id: string,
  matricula: string,
  apellidoPaterno: string | null,
  apellidoMaterno: string,
  nombres: string,
  estado: string,
  fechaExtinsion: string,
  empleador: {
    id: number,
    numeroPatronal: string,
    nombre: string,
    estado: string,
    aportes: string
  }
}

export const AseguradosService = {
  buscarPorMatricula: (matricula: string) =>{
    return apiClient.get<Asegurado[]>("asegurados/buscar-matricula", {
      params: {
        matricula
      }
    })
  }
}