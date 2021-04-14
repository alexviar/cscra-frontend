import { apiClient } from "../../../../commons/services"

export type Prestacion = {
  id: number,
  nombre: string,
}

export const PrestacionesService = {
  buscarPorNombre: (nombre: string) => {
    return apiClient.get<Prestacion[]>("/especialidades/buscar-nombre", {
      params: {
        nombre
      }
    })
  }
}