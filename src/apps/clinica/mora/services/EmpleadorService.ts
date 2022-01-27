import { apiClient , PaginatedResponse, Page} from "../../../../commons/services"
import { keysToUnderscore } from "../../../../commons/utils"

export type Empleador = {
  id: string
  numeroPatronal: string
  nombre: string
  // regionalId: number
}

type Filter = {
  numeroPatronal?: string
  regionalId?: number
}

export const EmpleadorService = {
  buscar: (page: Page, filter: Filter) => {
    return apiClient.get<PaginatedResponse<Empleador>>("empleadores", {
      params: {
        filter: keysToUnderscore(filter),
        page: page
      }
    })
  }
}