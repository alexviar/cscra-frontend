import apiClient from "./apiClient"

export type Regional = {
  id: number,
  nombre: string
}
export const RegionalesService = {
  obtener: () => {
    return apiClient.get<Regional[]>("regionales")
  }
}