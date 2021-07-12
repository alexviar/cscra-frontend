import apiClient from "../../../../commons/services/apiClient"

export type Area = {
  id: number,
  nombre: string
}
export const AreaService = {
  obtener: () => {
    return apiClient.get<Area[]>("areas")
  }
}