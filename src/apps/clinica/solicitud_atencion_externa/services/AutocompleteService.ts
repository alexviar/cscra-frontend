import { apiClient, PaginatedResponse } from "../../../../commons/services";

export const AutocompleteService = {
  medicos: (payload: {query: string, page: number, pageSize: number}, options: { signal: any}) =>{
    const {query, page, pageSize} = payload
    const {signal} = options
    return apiClient.get<PaginatedResponse<string>>("/autocomplete/medicos", {
      params: {
        text: query,
        page: {
          current: page,
          size: pageSize
        }
      },
      signal
    })
  }
}