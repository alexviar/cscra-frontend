import apiClient from "./apiClient"

export type Regional = {
  id: number,
  nombre: string
  ubicacion: {
    latitud: number
    longitud: number
  }
}
export const RegionalesService = {
  obtener: () => {
    return apiClient.get<Regional[]>("regionales")
  }
}